using eLonca.Common.Enums;
using eLonca.Common.Models;
using eLonca.Domain.Entities;
using eLonca.Domain.Interfaces;
using eLonca.Infrastructure.Persistence;

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

        public async Task<Result> UpdateProductStock(List<SaleItem> items, Sale sale)
        {
            foreach (var item in items)
            {
                var stockMovement = new StockMovement()
                {
                    SaleId = sale.Id,
                    ProductId = item.Product.Id,
                    Quantity = item.Quantity ?? 0,
                    MovementDate = DateTime.Now,
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
