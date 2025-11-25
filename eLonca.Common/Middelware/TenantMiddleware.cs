using Microsoft.AspNetCore.Http;

namespace eLonca.Common.Middelware
{
    public class TenantMiddleware
    {
        private readonly RequestDelegate _next;

        public TenantMiddleware(RequestDelegate next)
        {
            _next = next;
        }
        public async Task Invoke(HttpContext context)
        {
            if (context.User.Identity?.IsAuthenticated == true)
            {
                var tenantId = context.User.Claims.FirstOrDefault(x => x.Type == "TenantId")?.Value;
                if (!string.IsNullOrEmpty(tenantId))
                {
                    context.Items["TenantId"] = tenantId;
                }
                await _next(context);
            }
            else
            {
                // API isteği ise 401 döndür
                context.Response.StatusCode = 401;
                context.Response.ContentType = "application/json";
                await context.Response.WriteAsync("{\"message\":\"Unauthorized. Please login.\"}");
            }
        }
    }
}
