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
                // Token expire kontrolü
                var expClaim = context.User.Claims.FirstOrDefault(x => x.Type == "TokenExpr")?.Value;
                if (!string.IsNullOrEmpty(expClaim))
                {
                    if (DateTime.TryParse(expClaim, out DateTime expDate))
                    {
                        if (expDate < DateTime.Now)
                        {
                            // Token süresi dolmuş
                            context.Response.StatusCode = 401;
                            context.Response.ContentType = "application/json";
                            await context.Response.WriteAsync("{\"message\":\"Token expired. Please login again.\"}");
                            return;
                        }
                    }
                }

                // TenantId kontrolü
                var tenantId = context.User.Claims.FirstOrDefault(x => x.Type == "TenantId")?.Value;
                if (!string.IsNullOrEmpty(tenantId))
                {
                    context.Items["TenantId"] = tenantId;
                    await _next(context);
                }
                else
                {
                    // Login olmuş ama TenantId yok
                    context.Response.StatusCode = 403;
                    context.Response.ContentType = "application/json";
                    await context.Response.WriteAsync("{\"message\":\"Forbidden. TenantId not found.\"}");
                }
            }
            else
            {
                // Henüz login olmamış - login sayfasına gitsin
                await _next(context);
            }
        }
    }
}
