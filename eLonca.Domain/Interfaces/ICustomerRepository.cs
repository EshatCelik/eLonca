using eLonca.Common.DTOs;
using eLonca.Common.Models;
using eLonca.Domain.Entities;

namespace eLonca.Domain.Interfaces
{
    public interface ICustomerRepository : IGenericRepository<StoreCustomer>
    {
        Task<List<StoreCustomer>> GetCustomersWithPaginationAsync(string searchTerm, int pageNumber, int pageSize, CancellationToken cancellationToken);
        Task<List<StoreCustomer>> GetTotalCustomerCountAsync(string searchTerm, CancellationToken cancellationToken);
        Task<Result<StoreCustomer>> CheckIsAddedCustomer(Guid storeId, Guid customerId, CancellationToken cancellationToken);
        Task<Result<List<StoreCustomerDto>>> GetAllStoreCustomer(Guid storeId, CancellationToken cancellationToken);
        Task<Result<StoreCustomerDto>> GetByIdStoreCustomer( Guid storeCustomerId, CancellationToken cancellationToken);
    }
}
