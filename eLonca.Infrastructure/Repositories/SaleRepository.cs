using eLonca.Common.Models;
using eLonca.Domain.Entities;
using eLonca.Domain.Interfaces;
using eLonca.Infrastructure.Persistence;

namespace eLonca.Infrastructure.Repositories
{
    public class SaleRepository : GenericRepository<Sale>, ISaleRepository
    {
        private readonly IProductRepository _productRepository;
        public SaleRepository(LoncaDbContext dbContext, IProductRepository productRepository) : base(dbContext)
        {
            _productRepository = productRepository;
        }

        public async Task<Result<StoreCustomer>> CheckCustomerRelation(Guid? storeId, Guid? storeCustomerId, CancellationToken cancellationToken)
        {
            var customer = _dbContext.StoreCustomers.Where(x => x.StoreId == storeId && x.CustomerStoreId == storeCustomerId && x.IsActive && x.IsDeleted == false).FirstOrDefault();
            if (customer == null)
            {
                return Result<StoreCustomer>.Failure(null, "Müşteri bulunamadı", 400);
            }
            return Result<StoreCustomer>.Success(customer, "Müşteri bulundu", 200);
        }

        public async Task<Result<List<SaleItem>>> GetItemsTotalAmount(List<SaleItem> list, Guid storeId, Guid customerId)
        {
            var findCustomer = _dbContext.StoreCustomers.FirstOrDefault(x => x.StoreId == storeId && x.CustomerStoreId == customerId && x.IsActive && x.IsDeleted == false);

            if (findCustomer == null)
            {
                return Result<List<SaleItem>>.Failure(null, "Müşteri bulunamadı", 400);
            }
            var customerRate = findCustomer.DiscountRate;
            try
            {
                foreach (var item in list)
                {
                    var product = _productRepository.GetByIdAsync(item.ProductId);
                    if (!product.Result.IsSuccess)
                    {
                        return Result<List<SaleItem>>.Failure(null, "Fiyat Bilgisi bulunamadı", 400);
                    }

                    item.UnitPrice = Convert.ToDecimal(product.Result.Data.SalePrice);

                    var lineTotal = Convert.ToDouble(item.Quantity * item.UnitPrice);  // 2 X 150 ==300
                    var productDiscountAmount = Convert.ToDouble(lineTotal * (Convert.ToDouble(item.Discount) / 100));
                    var customerDiscountAmount = Convert.ToDouble(lineTotal * customerRate / 100); // 300 * 10/100 =30

                    var totalPrice = Convert.ToDouble(lineTotal - customerDiscountAmount - productDiscountAmount);  // 300 - 30 =270 olacaktır
                    item.CustomerDiscount = customerRate != null ? customerRate : 0M;
                    item.TotalPrice = Convert.ToDecimal(totalPrice);
                    item.Product = product.Result.Data;
                }
            }
            catch (Exception ex)
            {
                return Result<List<SaleItem>>.Failure(new List<string>() { ex.Message }, "Fiyat toplanırken hata meydana geldi", 400);
            }
            return Result<List<SaleItem>>.Success(list, "Toplam hesaplandı", 200);
        }
    }
}
