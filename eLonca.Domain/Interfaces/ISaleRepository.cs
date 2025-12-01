using eLonca.Common.Models;
using eLonca.Domain.Entities;

namespace eLonca.Domain.Interfaces
{
    public interface ISaleRepository:IGenericRepository<Sale>
    {
        Task<Result<List<SaleItem>>> GetItemsTotalAmount(List<SaleItem> list,Guid storeId,Guid customerId);
        Task<Result<StoreCustomer>> CheckCustomerRelation(Guid? storeId,Guid? storeCustomerId,CancellationToken cancellationToken);
    }
}
