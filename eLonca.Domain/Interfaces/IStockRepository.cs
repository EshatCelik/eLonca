using eLonca.Common.DTOs;
using eLonca.Common.Models;
using eLonca.Domain.Entities;

namespace eLonca.Domain.Interfaces
{
    public interface IStockRepository : IGenericRepository<StockMovement>
    {
        Task<Result<StockMovement>> GetStockByProductId(Guid? storeId, Guid? productId);
        Task<Result<List<StockMovementDto>>> GetAllStock(Guid tenantId);
    }
}
