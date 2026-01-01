using eLonca.Common.Models;
using eLonca.Domain.Entities;

namespace eLonca.Domain.Interfaces
{
    public interface IProductRepository:IGenericRepository<Product>
    {
        Task<Result> UpdateProductStock(List<SaleItem> items, Sale sale, Guid? storeId);
        Task<Result> CheckProductStock(List<SaleItem> saleItems);
    }
}
