using eLonca.Common.Models;
using eLonca.Domain.Entities;

namespace eLonca.Domain.Interfaces
{
    public interface IStoreRepository : IGenericRepository<Store>
    {
        Task<Result<List<Store>>> GetAllStoreForSearch(Guid storeId, string name);
    }
}
