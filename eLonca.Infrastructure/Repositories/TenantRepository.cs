using eLonca.Common.Models;
using eLonca.Domain.Entities;
using eLonca.Domain.Interfaces;
using eLonca.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace eLonca.Infrastructure.Repositories
{
    public class TenantRepository : GenericRepository<Tenant>, ITenantRepository
    {
        public TenantRepository(LoncaDbContext loncaDbContext) : base(loncaDbContext)
        {

        }
        public async Task<Result<List<Tenant>>> GetActiveTenantAsynct(CancellationToken cancellationToken)
        {
            var list = await _dbContext.Tenants
                .Where(x => x.IsActive)
                .OrderBy(x => x.Name)
                .ToListAsync(cancellationToken);
            if (list == null)
            {
                return Result<List<Tenant>>.Failure(null, "Tenant bulunamadı", 202);
            }
            return Result<List<Tenant>>.Success(list, "Aktif Tenantlar Listesi", statusCode: 200);
        }

        public async Task<Result<Tenant>> GetTenantByUserIdAsync(Guid userId, CancellationToken cancellationToken)
        {
            var user = _dbContext.Users.Where(x => x.Id == userId).FirstOrDefault();
            if (user == null)
            {
                return  Result<Tenant>.Failure(null,"Kullanıcı bulunamdı",400);
            }
            var tenant = await _dbContext.Tenants.Where(x => x.Id == user.TenantId).FirstOrDefaultAsync(cancellationToken);
            if (tenant == null)
            {
                return Result<Tenant>.Failure(null, "Kullanıcı bulunamdı", 400);
            }
            return Result<Tenant>.Success(tenant, "Kullanıcı bulunamdı", 400);
        }

        public async Task<Result> IsExistTenantByName(string name, CancellationToken cancellationToken = default)
        {
            var tenant = await _dbContext.Tenants.FirstOrDefaultAsync(x => x.Name == name, cancellationToken);
            if (tenant == null)
                return new Result { IsSuccess = true };
            return new Result { IsSuccess = false };
        }
    }
}
