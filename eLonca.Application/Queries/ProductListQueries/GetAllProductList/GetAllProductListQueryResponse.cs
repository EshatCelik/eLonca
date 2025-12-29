using eLonca.Common.Models;
using eLonca.Domain.Entities;
using MediatR; 

namespace eLonca.Application.Queries.ProductListQueries.GetAllProductList
{
    public class GetAllProductListQueryResponse : IRequest<Result<List<ProductList>>>
    {
        public Guid StoreId { get; set; }
        public Guid TenantId { get; set; }
    }
}
