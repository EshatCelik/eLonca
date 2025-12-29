using eLonca.Common.Models;
using eLonca.Domain.Entities;
using MediatR; 

namespace eLonca.Application.Queries.ProductListQueries.GetProductListById
{
    public class GetProductListByIdQueryResponse :IRequest<Result<ProductList>>
    {
        public Guid Id { get; set; }
    }
}
