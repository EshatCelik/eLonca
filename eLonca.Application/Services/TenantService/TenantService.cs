using eLonca.Common.Models;
using eLonca.Domain.Entities;
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
        public Result<Guid> GetTenantId()
        {
            try
            {

                var tenant = _httpContextAccessor.HttpContext?.User?.Claims?.FirstOrDefault(x => x.Type == "TenantId")?.Value;

                if (tenant == null)
                    return Result<Guid>.Failure(null, "tenant ıdbulunamadı", 400);
                return Result<Guid>.Success(Guid.Parse(tenant), "tenant ıd", 400);
            }
            catch (Exception)
            {
                return Result<Guid>.Failure(null, "tenant ıd bulunamadı", 400);

            }
        }
    }
}
