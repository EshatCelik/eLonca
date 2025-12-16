using eLonca.Common.Models;
using eLonca.Domain.Entities;
using MediatR;

namespace eLonca.Application.Queries.ProductQueries.GetAllProduct
{
    public class GetAllProductQueryResponse:IRequest<Result<List<Product>>>
    {
    }
}
