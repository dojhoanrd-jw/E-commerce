using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;

namespace ECommerce.Api.Controllers;

public abstract class ApiControllerBase : ControllerBase
{
    protected int CurrentUserId =>
        int.Parse(
            User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? User.FindFirstValue("sub")
            ?? "0");

    protected bool IsAdmin => User.IsInRole("Admin");
}
