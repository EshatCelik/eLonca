using eLonca.Common.Models;
using eLonca.Domain.Entities;
using eLonca.Domain.Interfaces;
using eLonca.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace eLonca.Infrastructure.Repositories
{
    public class UserRepository : GenericRepository<User>, IUserRepository
    {
        public UserRepository(LoncaDbContext loncaDbContext) : base(loncaDbContext)
        {

        }

        public async Task<Result<User>> GetByEmailAndTenantAsync(string email, Guid tenantId, CancellationToken cancellationToken)
        {
            var user = await _dbContext.Users.Include(x => x.Tenant).FirstOrDefaultAsync(x => x.Email == email && x.TenantId == tenantId, cancellationToken);

            if (user == null)
            {
                return Result<User>.Failure(null, "Kullanıcı bulunamadı", 400);
            }
            return Result<User>.Success(user, "Kullanıcı listesi", 200);
        }

        public async Task<Result<List<User>>> GetUserByTenantAsync(Guid tenantId, CancellationToken cancellationToken)
        {
            var tenant = await _dbContext.Users.Where(x => x.TenantId == tenantId).ToListAsync(cancellationToken);
            if (tenant == null) { return Result<List<User>>.Failure(null, "Tenant bulunamadı", 404); }
            return Result<List<User>>.Success(tenant, "Tenant Listesi", 200);
        }

        public async Task<Result<bool>> IsEmailExistInTenantAsync(string email, Guid tenantId, CancellationToken cancellationToken)
        {
            var isExist = await _dbSet.FirstOrDefaultAsync(x => x.Email == email && x.TenantId == tenantId, cancellationToken);
            if (isExist == null)
            {
                return Result<bool>.Failure(null, "Kullanıcı bulunamadı,yada Tenant bulunamadı", 404);
            }
            return Result<bool>.Success(true, "kullanıcı mevcut", 200);
           
        }
    }
}
