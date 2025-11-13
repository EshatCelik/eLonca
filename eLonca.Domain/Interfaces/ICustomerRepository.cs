using eLonca.Domain.Entities;

namespace eLonca.Domain.Interfaces
{
    public interface ICustomerRepository : IGenericRepository<Customer>
    {
        Task<List<Customer>> GetCustomersWithPaginationAsync(
            string searchTerm,
            int pageNumber,
            int pageSize,
            CancellationToken cancellationToken );
        Task<List<Customer>> GetTotalCustomerCountAsync(string searchTerm,CancellationToken cancellationToken);

    }
}
