using eLonca.Common.DTOs;
using eLonca.Common.Models;
using eLonca.Domain.Entities;
using eLonca.Domain.Interfaces;
using eLonca.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

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

        public async Task<Result<List<SaleItem>>> GetAllSaleItemById(Guid saleId, CancellationToken cancellationToken)
        { 
            var list=  _dbContext.SaleItems.Where(x=>x.SaleId == saleId).ToList();
            return Result<List<SaleItem>>.Success(list, "Liste başarılı", 200);
        }

        public async Task<Result<List<GetAllSalesDto>>> GetAllSales(Guid tenantId, CancellationToken cancellationToken)
        {
            var sales = (from s in _dbContext.Sales 
                         join st in _dbContext.Stores on s.StoreId equals st.Id
                         join sc in _dbContext.StoreCustomers on s.StoreCustomerId equals sc.Id into scGroup
                         from sc in scGroup.DefaultIfEmpty()
                         where s.TenantId == tenantId
                         select new GetAllSalesDto()
                         {
                             Id = s.Id,
                             SaleDate = s.SaleDate.ToString("dd/MM/yyyy"), // veya "dd.MM.yyyy"
                             InvoiceNumber = s.InvoiceNumber,
                             TotalAmount = s.TotalAmount,
                             PaidAmount = s.PaidAmount,
                             RemainingAmount = s.RemainingAmount,
                             PaymentType = s.PaymentType,
                             PaymentStatus = s.PaymentStatus,
                             Notes = s.Notes,
                             StoreId = st.Id,
                             IsActive = s.IsActive,
                             StoreName = st.StoreName,
                             StoreCutomerId = s.StoreCustomerId,
                             CustomerCode = sc != null ? sc.CustomerCode : null,
                             SaleItems = (from si in _dbContext.SaleItems
                                          join p in _dbContext.Products on si.ProductId equals p.Id
                                          where si.SaleId == s.Id
                                          select new SaleItemDto()
                                          {
                                              Id = si.Id,
                                              ProductId = si.ProductId,
                                              ProductName = p.ProductName,
                                              ProductCode = p.ProductCode,
                                              Quantity = si.Quantity,
                                              UnitPrice = si.UnitPrice,
                                              Discount = si.Discount,
                                              CustomerDiscount = si.CustomerDiscount,
                                              TotalPrice = si.TotalPrice
                                          }).ToList()
                         }).ToList();

            foreach (var sale in sales)
            {
                sale.TotalAmount = sale.SaleItems.Sum(x => x.TotalPrice);
            }
            return Result<List<GetAllSalesDto>>.Success(sales, "Satış listesi", 200);
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
                    item.CustomerDiscount = customerRate != null ? customerRate : 0;
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

        public async Task<Result<GetAllSalesDto>> GetSaleById(Guid id, CancellationToken cancellationToken)
        {
            var sales = (from s in _dbContext.Sales
                         join st in _dbContext.Stores on s.StoreId equals st.Id
                         join sc in _dbContext.StoreCustomers on s.StoreCustomerId equals sc.Id into scGroup
                         from sc in scGroup.DefaultIfEmpty()
                         where s.Id == id
                         select new GetAllSalesDto()
                         {
                             Id = s.Id,
                             SaleDate = s.SaleDate.ToString("dd/MM/yyyy"), // veya "dd.MM.yyyy"
                             InvoiceNumber = s.InvoiceNumber,
                             TotalAmount = s.TotalAmount,
                             PaidAmount = s.PaidAmount,
                             RemainingAmount = s.RemainingAmount,
                             PaymentType = s.PaymentType,
                             PaymentStatus = s.PaymentStatus,
                             Notes = s.Notes,
                             StoreId = st.Id,
                             IsActive=s.IsActive,
                             StoreName = st.StoreName,
                             StoreCutomerId = s.StoreCustomerId,
                             CustomerCode = sc != null ? sc.CustomerCode : null,
                             SaleItems = (from si in _dbContext.SaleItems
                                          join p in _dbContext.Products on si.ProductId equals p.Id
                                          where si.SaleId == s.Id
                                          select new SaleItemDto()
                                          {
                                              Id = si.Id,
                                              ProductId = si.ProductId,
                                              ProductName = p.ProductName,
                                              ProductCode = p.ProductCode,
                                              Quantity = si.Quantity,
                                              UnitPrice = si.UnitPrice,
                                              Discount = si.Discount,
                                              CustomerDiscount = si.CustomerDiscount,
                                              TotalPrice = si.TotalPrice,
                                              CreateDate=si.CreateAt.ToString("dd/MM/yyy")
                                          }).ToList()
                         }).FirstOrDefault();

            sales.TotalAmount = sales.SaleItems.Sum(x => x.TotalPrice);
            return Result<GetAllSalesDto>.Success(sales, "Satış listesi", 200);
        }
    }
}
