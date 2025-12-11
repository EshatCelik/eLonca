using eLonca.Common.Models;

namespace eLonca.Application.Services.TenantService
{
    public interface ITenantService
    {
        Result<Guid> GetTenantId();   
    }
}
