using eLonca.Common.Enums;
using eLonca.Common.Models;
using eLonca.Domain.Entities;
using eLonca.Domain.Interfaces;
using eLonca.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using static Azure.Core.HttpHeader;

namespace eLonca.Infrastructure.Repositories
{
    public class ProductRepository : GenericRepository<Product>, IProductRepository
    {
        private readonly IUnitOfWork unitOfWork;
        public ProductRepository(LoncaDbContext dbContext, IUnitOfWork unitOfWork) : base(dbContext)
        {
            this.unitOfWork = unitOfWork;
        }

        public async Task<Result> CheckProductStock(List<SaleItem> saleItems)
        {
            foreach (var item in saleItems)
            {
                var stockIn = _dbContext.StockMovements.Where(x => x.ProductId == item.ProductId && x.MovementType == MovementType.In && x.IsActive == true && x.IsDeleted == false).Sum(x => x.Quantity);
                var stockOut = _dbContext.StockMovements.Where(x => x.ProductId == item.ProductId && x.MovementType == MovementType.Out && x.IsActive == true && x.IsDeleted == false).Sum(x => x.Quantity);
                var currenStockCount = stockIn - stockOut;
                if (currenStockCount < item.Quantity)
                {
                    return Result.Failure($"Ürün sayısı stokta bulunmuyor", null, 400);
                }

            }
            return Result.Success("Ürün Stokta bulunuyor", 200);
        }

        public async Task<Result<string>> GetAllProductItemsName(List<SaleItem> items)
        {
            try
            {
                // 1. Önce ProductId'leri bellekten al
                var productIds = items
                    .Where(x => x.ProductId.HasValue)
                    .Select(x => x.ProductId.Value)
                    .Distinct()
                    .ToList();

                // 2. Eğer ProductId yoksa boş döndür
                if (!productIds.Any())
                {
                    return Result<string>.Success(string.Empty, "Ürün bulunamadı", 200);
                }

                // 3. Veritabanından ürün isimlerini çek
                var products =  _dbContext.Products
                    .Where(p => productIds.Contains(p.Id))
                    //.Select(p => p.ProductName)
                    .ToDictionary(p=>p.Id,p=>p.ProductName);

                var result = items
                    .Where(x => x.ProductId.HasValue && products.ContainsKey(x.ProductId.Value))
                    .Select(x => $"({x.Quantity}x {products[x.ProductId.Value]})");

                // 4. Virgülle birleştir
                return Result<string>.Success(string.Join(", ", result), "Liste başarılı", 200);
            }
            catch (Exception ex)
            {
                return Result<string>.Failure(null, "Liste hatalı", 400);
            }
        }

        public async Task<Result> UpdateProductStock(List<SaleItem> items, Sale sale,Guid? storeId)
        {
            foreach (var item in items)
            {
                var stockMovement = new StockMovement()
                {
                    SaleId = sale.Id,
                    ProductId = item.Product.Id,
                    Quantity = item.Quantity ?? 0,
                    MovementDate = DateTime.Now,
                    StoreId=storeId,
                    MovementType = MovementType.Out,
                    Notes = $"{item.Product.ProductName}=>{item.Quantity} kadar satıldı, stoktan çıkarıldı",

                };
                _dbContext.StockMovements.Add(stockMovement);
            }
            _dbContext.SaveChanges();

            return Result.Success("Stok başarıyla güncellendi", 200);
        }
    }
}
