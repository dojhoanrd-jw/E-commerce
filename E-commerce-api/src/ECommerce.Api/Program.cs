using System.Text;
using System.Text.Json.Serialization;
using ECommerce.Api.Handlers;
using ECommerce.Application;
using ECommerce.Infrastructure;
using ECommerce.Infrastructure.Authentication;
using ECommerce.Infrastructure.Payments;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

builder.Configuration.AddEnvironmentVariables();

builder.Services.AddControllers()
    .AddJsonOptions(options =>
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()));

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Global exception handling -> consistent ProblemDetails responses
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddProblemDetails();

// CORS — allows one or more comma-separated origins from FRONTEND_URL
var frontendUrl = Environment.GetEnvironmentVariable("FRONTEND_URL")
    ?? builder.Configuration["FrontendUrl"];

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        if (!string.IsNullOrWhiteSpace(frontendUrl))
        {
            var origins = frontendUrl.Split(
                ',',
                StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);

            policy.WithOrigins(origins)
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        }
    });
});

// JWT authentication (the signing key comes from JWT_KEY in production)
var jwtSettings = builder.Configuration.GetSection("Jwt").Get<JwtSettings>() ?? new JwtSettings();
jwtSettings.Key = Environment.GetEnvironmentVariable("JWT_KEY") ?? jwtSettings.Key;

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtSettings.Issuer,
            ValidAudience = jwtSettings.Audience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.Key))
        };
    });

builder.Services.AddAuthorization();

// Connection string: environment variable first, appsettings fallback
var connectionString = Environment.GetEnvironmentVariable("DATABASE_URL")
    ?? builder.Configuration.GetConnectionString("DefaultConnection");

// Stripe payment settings (secret key comes from STRIPE_SECRET_KEY)
var frontendBase = !string.IsNullOrWhiteSpace(frontendUrl)
    ? frontendUrl.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)[0]
    : "http://localhost:4200";

var stripeSettings = new StripeSettings
{
    SecretKey = Environment.GetEnvironmentVariable("STRIPE_SECRET_KEY")
        ?? builder.Configuration["Stripe:SecretKey"] ?? string.Empty,
    Currency = "usd",
    SuccessUrl = $"{frontendBase}/checkout/success",
    CancelUrl = $"{frontendBase}/cart"
};

// Firebase sign-in (service account JSON comes from FIREBASE_CREDENTIALS)
var firebaseSettings = new FirebaseSettings
{
    CredentialsJson = Environment.GetEnvironmentVariable("FIREBASE_CREDENTIALS")
        ?? builder.Configuration["Firebase:CredentialsJson"] ?? string.Empty
};

builder.Services.AddApplication();
builder.Services.AddInfrastructure(connectionString, jwtSettings, stripeSettings, firebaseSettings);

var app = builder.Build();

app.UseExceptionHandler();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
