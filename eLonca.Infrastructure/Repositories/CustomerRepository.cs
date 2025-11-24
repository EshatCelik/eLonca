using eLonca.Domain.Entities;
using eLonca.Domain.Interfaces;
using eLonca.Infrastructure.Persistence;

namespace eLonca.Infrastructure.Repositories
{
    public class CustomerRepository : GenericRepository<Customer>, ICustomerRepository
    {
        public CustomerRepository(LoncaDbContext dbContext) : base(dbContext)
        {
        }

        public Task<List<Customer>> GetCustomersWithPaginationAsync(string searchTerm, int pageNumber, int pageSize, CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }

        public Task<List<Customer>> GetTotalCustomerCountAsync(string searchTerm, CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }
    }
}
