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
    }
}
