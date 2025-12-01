using eLonca.Common.Models;
using eLonca.Domain.Entities;
using eLonca.Domain.Interfaces;
using eLonca.Infrastructure.Persistence;

namespace eLonca.Infrastructure.Repositories
{
    public class CustomerRepository : GenericRepository<StoreCustomer>, ICustomerRepository
    {
        public CustomerRepository(LoncaDbContext dbContext) : base(dbContext)
        {
        }

        public async Task<Result<StoreCustomer>> CheckIsAddedCustomer(Guid storeId, Guid customerId, CancellationToken cancellationToken)
        {
            var store = _dbContext.StoreCustomers.Where(x => x.StoreId == storeId && x.CustomerStoreId == customerId && x.IsActive).FirstOrDefault();
            if (store == null)
            {
                return Result<StoreCustomer>.Success(null, "Müşteri bulunamadı", 200);
            }
            return Result<StoreCustomer>.Failure(null, "Müşteri daha önce eklenmiş", 200);
        }

        public Task<List<StoreCustomer>> GetCustomersWithPaginationAsync(string searchTerm, int pageNumber, int pageSize, CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }

        public Task<List<StoreCustomer>> GetTotalCustomerCountAsync(string searchTerm, CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }
    }
}
