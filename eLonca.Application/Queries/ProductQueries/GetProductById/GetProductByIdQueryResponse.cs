using eLonca.Common.Models;
using eLonca.Domain.Entities;
using MediatR;

namespace eLonca.Application.Queries.ProductQueries.GetProductById
{
    public class GetProductByIdQueryResponse:IRequest<Result<Product>>
    {
        public Guid Id { get; set; }
    }
}
