using eLonca.Common.DTOs;
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

        public async Task<Result<List<StoreCustomerDto>>> GetAllStoreCustomer(Guid storeId, CancellationToken cancellationToken)
        {
            var customer = (from c in _dbContext.StoreCustomers
                            join s in _dbContext.Stores on c.CustomerStoreId equals s.Id
                            where c.StoreId == storeId && c.IsActive
                            select new StoreCustomerDto()
                            {
                                Id = c.Id,
                                StoreName = s.StoreName,
                                StoreId = c.StoreId,
                                CustomerId = c.CustomerStoreId,
                                Address = s.Address,
                                Email = s.Email,
                                LogoUrl = s.LogoUrl,
                                Phone = s.Phone,
                                TaxNumber = s.TaxNumber,
                                DiscountRate = c.DiscountRate,
                                CustomerType = c.CustomerType,
                                CustomerCode = c.CustomerCode,
                                IsActive=c.IsActive,
                                CreateAt = c.CreateAt
                            }).OrderByDescending(x=>x.CreateAt).ToList();
            if (customer == null)
            {
                return Result<List<StoreCustomerDto>>.Failure(null, "Müşteri bulunamadı", 400);
            }
            return Result<List<StoreCustomerDto>>.Success(customer, "Müşteri Listesi", 400);

        }

        public async Task<Result<StoreCustomerDto>> GetByIdStoreCustomer(Guid storeCustomerId, CancellationToken cancellationToken)
        {
            var customer = (from c in _dbContext.StoreCustomers
                           join s in _dbContext.Stores on c.CustomerStoreId equals s.Id
                           where  c.Id == storeCustomerId
                           select new StoreCustomerDto
                           {
                               Id = c.Id,
                               StoreName = s.StoreName,
                               StoreId = s.Id,
                               CustomerId = c.CustomerStoreId,
                               Address = s.Address,
                               Email = s.Email,
                               LogoUrl = s.LogoUrl,
                               Phone = s.Phone,
                               TaxNumber = s.TaxNumber,
                               DiscountRate = c.DiscountRate,
                               CustomerType = c.CustomerType,
                               CustomerCode = c.CustomerCode
                           }).FirstOrDefault();
            if (customer == null)
            {
                return Result<StoreCustomerDto>.Failure(null, "Müşteri bulunamadı", 400);
            }
            return Result<StoreCustomerDto>.Success(customer, "Müşteri Listesi", 400);
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
