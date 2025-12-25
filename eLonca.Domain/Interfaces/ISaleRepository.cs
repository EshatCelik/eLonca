using eLonca.Common.DTOs;
using eLonca.Common.Models;
using eLonca.Domain.Entities;

namespace eLonca.Domain.Interfaces
{
    public interface ISaleRepository:IGenericRepository<Sale>
    {
        Task<Result<List<SaleItem>>> GetItemsTotalAmount(List<SaleItem> list,Guid storeId,Guid customerId);
        Task<Result<StoreCustomer>> CheckCustomerRelation(Guid? storeId,Guid? storeCustomerId,CancellationToken cancellationToken);
        Task<Result<List<GetAllSalesDto>>> GetAllSales(Guid storeId,Guid storeCustomerId, CancellationToken cancellationToken); 
        Task<Result<GetAllSalesDto>> GetSaleById(Guid id, CancellationToken cancellationToken); 
        Task<Result<List<SaleItem>>> GetAllSaleItemById(Guid saleId, CancellationToken cancellationToken); 
    }
}
