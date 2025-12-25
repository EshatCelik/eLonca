using eLonca.Common.DTOs;
using eLonca.Common.Models;
using MediatR;

namespace eLonca.Application.Queries.StockQueries.GetAllProductStockMovement
{
    public class GetAllProductStockMovementQueryResponse : IRequest<Result<List<StockMovementDto>>>
    {
        public Guid StoreId { get; set; }
        public Guid ProductId { get; set; }
    }
}
