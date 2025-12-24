using eLonca.Common.DTOs;
using eLonca.Common.Enums;
using eLonca.Common.Models;
using eLonca.Domain.Entities;
using eLonca.Domain.Interfaces;
using eLonca.Infrastructure.Persistence;

namespace eLonca.Infrastructure.Repositories
{
    public class StockRepository : GenericRepository<StockMovement>, IStockRepository
    {
        public StockRepository(LoncaDbContext dbContext) : base(dbContext)
        {
        }

        public async Task<Result<StockMovement>> GetStockByProductId(Guid? stockId, Guid? productId)
        {
            var stock = _dbSet.Where(x => x.ProductId == productId && x.Id == stockId).FirstOrDefault();
            if (stock == null)
            {
                return Result<StockMovement>.Failure(null, "Stok bulunamadı", 400);
            }
            return Result<StockMovement>.Success(stock, "Stok listelemesi başarılı", 200);
        }
        public async Task<Result<List<StockMovementDto>>> GetAllStock(Guid tenantId)
        {
            var list = (from st in _dbContext.StockMovements
                        join p in _dbContext.Products on st.ProductId equals p.Id
                        where st.TenantId == tenantId
                        group st by new
                        {
                            st.ProductId,
                            p.ProductName,
                            p.ProductCode,
                            p.SalePrice,
                            p.MinStockLevel,
                            p.PurchasePrice
                            // ❌ st.MovementType  --> BUNU KALDIR!
                        } into g
                        select new StockMovementDto()
                        {
                            ProductId = g.Key.ProductId,
                            ProductName = g.Key.ProductName,
                            ProductCode = g.Key.ProductCode,
                            ProductSalePrice = g.Key.SalePrice,
                            ProductPurchasePrice = g.Key.PurchasePrice,
                            MinStockLevel = g.Key.MinStockLevel,

                            MovementDate = g.Max(x => x.MovementDate),

                            // ✅ Tüm In hareketlerini topla
                            StockInQuantity = g.Where(x => x.MovementType == MovementType.In)
                                               .Sum(x => (decimal?)x.Quantity) ?? 0,

                            // ✅ Tüm Out hareketlerini topla
                            StockOutQuantity = g.Where(x => x.MovementType == MovementType.Out)
                                                .Sum(x => (decimal?)x.Quantity) ?? 0,

                            // ✅ Kalan stok
                            StockRemainingQuantity = g.Where(x => x.MovementType == MovementType.In)
                                                      .Sum(x => (decimal?)x.Quantity) ?? 0
                                                    - (g.Where(x => x.MovementType == MovementType.Out)
                                                      .Sum(x => (decimal?)x.Quantity) ?? 0),

                            Notes = string.Join("; ", g.Select(x => x.Notes).Where(n => !string.IsNullOrEmpty(n)))
                        })
            .OrderBy(x => x.ProductName)
            .ToList();
            return Result<List<StockMovementDto>>.Success(list, "Liste Başarılı", 200);
        }
    }
}
