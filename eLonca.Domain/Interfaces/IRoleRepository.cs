using eLonca.Common.Models;
using eLonca.Domain.Entities;

namespace eLonca.Domain.Interfaces
{
    public interface IRoleRepository :IGenericRepository<Role>
    {
        Task<Result<Role>>GetRoleByCode(string code ,Guid storeId);
    }
}
