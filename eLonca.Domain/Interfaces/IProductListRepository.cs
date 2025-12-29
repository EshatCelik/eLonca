using eLonca.Common.Models;
using eLonca.Domain.Entities;

namespace eLonca.Domain.Interfaces
{
    public interface IProductListRepository :IGenericRepository<ProductList>
    {
        Task<Result<ProductList>> CheckName(string name, Guid storeId);
    }
}
