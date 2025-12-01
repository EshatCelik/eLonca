using eLonca.Common.Models;
using eLonca.Domain.Entities;

namespace eLonca.Domain.Interfaces
{
    public interface ITenantRepository : IGenericRepository<Tenant>
    {
        Task<Result<List<Tenant>>> GetActiveTenantAsynct(CancellationToken cancellationToken = default);
        Task<Result<Tenant>> GetTenantByUserIdAsync(Guid userId, CancellationToken cancellationToken = default);
        Task<Result> IsExistTenantByName(string name, CancellationToken cancellationToken = default);
        Task<Result<Tenant>>CreateTenant(Tenant tenant, CancellationToken cancellationToken = default);
    }
}
