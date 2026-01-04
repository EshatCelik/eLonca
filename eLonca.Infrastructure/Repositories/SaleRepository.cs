using eLonca.Common;
using eLonca.Common.DTOs;
using eLonca.Common.DTOs.SaleItem;
using eLonca.Common.Enums;
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

        public async Task<Result<Sale>> AddReturnItemToSale(List<ReturnSaleItemDto> _items, Sale sale, CancellationToken cancellationToken)
        {

            foreach (var s in _items)
            {

                var findItem = _dbContext.SaleItems.Where(x => x.SaleId == sale.Id && x.ProductId == s.ProductId && x.SaleType == SaleItemType.Sale).FirstOrDefault();
                if (findItem != null && (findItem.Quantity > s.Quantity))
                {
                    findItem.Quantity -= s.Quantity;
                    findItem.TotalPrice = findItem.Quantity * findItem.UnitPrice;
                    sale.TotalAmount -= s.Quantity * s.UnitPrice;

                    var createNewReturnItem = new SaleItem()
                    {
                        SaleId = sale.Id,
                        SaleType = SaleItemType.Return,
                        Quantity = s.Quantity,
                        ProductId = s.ProductId,
                        TotalPrice = 0

                    };
                    sale.SaleItems.Add(createNewReturnItem);


                }
                else if (findItem != null && (findItem.Quantity == s.Quantity))
                {
                    var isExistReturnType = _dbContext.SaleItems.Where(x => x.SaleId == sale.Id && x.ProductId == s.ProductId && x.SaleType == SaleItemType.Return).FirstOrDefault();
                    if (isExistReturnType != null)
                    {
                        isExistReturnType.Quantity += s.Quantity;
                        sale.TotalAmount -= s.Quantity * s.UnitPrice;
                        findItem.Quantity = 0;
                        findItem.TotalPrice = 0;
                        findItem.IsActive = false;
                        findItem.IsDeleted = true;

                        _dbContext.SaleItems.Remove(findItem);
                        _dbContext.SaveChanges();
                    }
                    else
                    {

                        findItem.SaleType = SaleItemType.Return;
                        findItem.TotalPrice = 0;
                    }
                }
                else if (findItem == null)
                {
                    return Result<Sale>.Failure(null, "Ürün Kalemleri bulunamadı", 400);
                }

            }
            return Result<Sale>.Success(sale, "Satış detay güncelleme başarılı", 200);

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
            var list = _dbContext.SaleItems.Where(x => x.SaleId == saleId).ToList();
            return Result<List<SaleItem>>.Success(list, "Liste başarılı", 200);
        }

        public async Task<Result<List<GetAllSalesDto>>> GetAllSales(Guid currentStoreId, Guid partnerStoreId, CancellationToken cancellationToken)
        {
            var storeCustomerIds = _dbContext.StoreCustomers
                                        .Where(sc =>
                                            (sc.StoreId == currentStoreId && sc.CustomerStoreId == partnerStoreId) ||
                                            (sc.StoreId == partnerStoreId && sc.CustomerStoreId == currentStoreId))
                                        .Select(sc => sc.Id)
                                        .ToList();

            if (!storeCustomerIds.Any())
            {
                return Result<List<GetAllSalesDto>>.Failure(null, "Satış listesi bulunamadı", 400);

            }

            // 2. Bu StoreCustomer'lara ait tüm satışları getir
            var sales = (
                from sale in _dbContext.Sales
                join si in _dbContext.SaleItems on sale.Id equals si.SaleId into saleItemGroup
                join storeCustomer in _dbContext.StoreCustomers on sale.StoreCustomerId equals storeCustomer.Id
                join sellerStore in _dbContext.Stores on sale.StoreId equals sellerStore.Id
                join buyerStore in _dbContext.Stores on storeCustomer.CustomerStoreId equals buyerStore.Id
                join u in _dbContext.Users on sale.CreatedBy equals u.Id
                where storeCustomerIds.Contains(sale.StoreCustomerId.Value)
                orderby sale.CreateAt descending
                select new GetAllSalesDto
                {
                    Id = sale.Id,
                    SaleDate = sale.SaleDate.ToString("yyyy-MM-dd HH:mm"),
                    SaleUser = u.FullName,
                    InvoiceNumber = sale.InvoiceNumber,
                    TotalAmount = sale.TotalAmount,
                    PaidAmount = sale.PaidAmount,
                    RemainingAmount = sale.RemainingAmount,
                    PaymentStatus = sale.PaymentStatus,
                    Notes = sale.Notes,
                    SaleItems = saleItemGroup.Where(x => x.IsDeleted == false && x.IsActive && x.SaleType == SaleItemType.Sale).Select(a => new SaleItemDto
                    {
                        Id = a.Id,
                        SaleId = a.SaleId,
                        Quantity = a.Quantity,
                        UnitPrice = a.UnitPrice,
                        ProductId = a.ProductId
                    }).ToList(),
                    SaleReturnItems = saleItemGroup.Where(x => x.IsDeleted == false && x.IsActive && x.SaleType == SaleItemType.Return).Select(a => new SaleItemDto
                    {
                        Id = a.Id,
                        SaleId = a.SaleId,
                        Quantity = a.Quantity,
                        UnitPrice = a.UnitPrice,
                        ProductId = a.ProductId
                    }).ToList(),
                    // Satış mı Alış mı? (benim store'dan çıkıyorsa Satış, giriyorsa Alış)
                    IsSale = sale.StoreId == currentStoreId,

                    // Satıcı bilgileri
                    SellerStoreId = sellerStore.Id,
                    SellerStoreName = sellerStore.StoreName,

                    // Alıcı bilgileri
                    BuyerStoreId = buyerStore.Id,
                    BuyerStoreName = buyerStore.StoreName,

                    // Müşteri bilgileri
                    CustomerCode = storeCustomer.CustomerCode,
                    CustomerType = storeCustomer.CustomerType,
                    DiscountRate = storeCustomer.DiscountRate,

                    CreatedAt = sale.CreateAt
                }
            ).ToList();

            //foreach (var sale in sales)
            //{
            //    sale.TotalAmount = sale..Sum(x => x.TotalPrice);
            //}
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
                             IsActive = s.IsActive,
                             StoreName = st.StoreName,
                             StoreCutomerId = s.StoreCustomerId,
                             CustomerCode = sc != null ? sc.CustomerCode : null,
                             SaleItems = (from si in _dbContext.SaleItems
                                          join p in _dbContext.Products on si.ProductId equals p.Id
                                          where si.SaleId == s.Id && si.IsDeleted == false && si.IsActive && si.SaleType == SaleItemType.Sale
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
                                              CreateDate = si.CreateAt.ToString("dd/MM/yyy"),
                                              ReturnedQuantity = si.ReturnedQuantity,
                                              SaleItemType = si.SaleType
                                          }).ToList(),
                             SaleReturnItems = (from si in _dbContext.SaleItems
                                                join p in _dbContext.Products on si.ProductId equals p.Id
                                                where si.SaleId == s.Id && si.IsDeleted == false && si.IsActive && si.SaleType == SaleItemType.Return
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
                                                    CreateDate = si.CreateAt.ToString("dd/MM/yyy"),
                                                    ReturnedQuantity = si.ReturnedQuantity,
                                                    SaleItemType = si.SaleType
                                                }).ToList()
                         }).FirstOrDefault();

            sales.TotalAmount = sales.SaleItems.Sum(x => x.TotalPrice);
            return Result<GetAllSalesDto>.Success(sales, "Satış listesi", 200);
        }
    }
}
