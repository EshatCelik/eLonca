using eLonca.Application.DTOs;
using eLonca.Common.Models;
using eLonca.Domain.Entities;
using MediatR;

namespace eLonca.Application.Queries.StockQueries.GetAllStockQuery
{
    public class GetAllStockQuery:IRequest<Result<List<StockMovement>>>
    {
    }
}
