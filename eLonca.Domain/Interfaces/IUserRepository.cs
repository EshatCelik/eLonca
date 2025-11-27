using eLonca.Common.Models;
using eLonca.Domain.Entities;

namespace eLonca.Domain.Interfaces
{
    public interface IUserRepository : IGenericRepository<User>
    {
        Task<Result<User>> GetByEmailAndTenantAsync(string email,  CancellationToken cancellationToken);
        Task<Result<List<User>>> GetUserByTenantAsync(Guid tenantId, CancellationToken cancellationToken);
        Task<Result<bool>> IsEmailExistInTenantAsync(string email, Guid storeId, string username, CancellationToken cancellationToken);
        Task<Result> CreateUserAccessToken(User user,string token, CancellationToken cancellationToken); 
    }
}
