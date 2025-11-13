using Microsoft.AspNetCore.Http;

namespace eLonca.Application.Services.TenantService
{
    public class TenantService : ITenantService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public TenantService(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }
        public Guid GetTenantId()
        {
            try
            {

            var host = _httpContextAccessor.HttpContext?.Request.Host.Host;
            var tenantId = host?.Split('.')[0];
            if (tenantId == null)
                tenantId = _httpContextAccessor.HttpContext?.User.FindFirst("TenantId")?.Value;
            return Guid.Parse(tenantId);
            }
            catch (Exception)
            {
                 return Guid.Empty;
            }
        }
    }
}
