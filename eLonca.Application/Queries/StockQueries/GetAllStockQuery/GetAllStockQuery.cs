using eLonca.Common.DTOs;
using eLonca.Common.Models;
using MediatR;

namespace eLonca.Application.Queries.StockQueries.GetAllStockQuery
{
    public class GetAllStockQuery:IRequest<Result<List<StockMovementDto>>>
    {
    }
}
