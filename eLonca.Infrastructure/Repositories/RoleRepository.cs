using eLonca.Common.Models;
using eLonca.Domain.Entities;
using eLonca.Domain.Interfaces;
using eLonca.Infrastructure.Persistence;

namespace eLonca.Infrastructure.Repositories
{
    public class RoleRepository : GenericRepository<Role>, IRoleRepository
    {

        public RoleRepository(LoncaDbContext dbContext) : base(dbContext)
        {
        }

        public async Task<Result<Role>> GetRoleByCode(string code, Guid storeId)
        {
            var role = _dbContext.Roles.Where(x => x.RoleCode.Equals(code.ToUpper()) && x.StoreId == storeId).FirstOrDefault();
            if (role != null)
            {
                return Result<Role>.Failure(null, "Role Daha öncek eklenmiş ", 400);
            }
            return Result<Role>.Success(role, "Role bulunamadı, eklenebilir ", 200);

        }
    }
}
