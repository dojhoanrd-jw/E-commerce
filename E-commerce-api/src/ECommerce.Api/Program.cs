using ECommerce.Application;
using ECommerce.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

builder.Configuration.AddEnvironmentVariables();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

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

// Connection string: environment variable first, appsettings fallback
var connectionString = Environment.GetEnvironmentVariable("DATABASE_URL")
    ?? builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddApplication();
builder.Services.AddInfrastructure(connectionString);

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors();
app.UseAuthorization();
app.MapControllers();

app.Run();
