using eLonca.Common.Models;
using eLonca.Domain.Entities;
using MediatR;

namespace eLonca.Application.Queries.ProductListQueries.GetAllProductListItem
{
    public class GetAllProductListItemsQueryResponse :IRequest<Result<List<ProductListItem>>>
    {
        public Guid ListId { get; set; }
    }
}
