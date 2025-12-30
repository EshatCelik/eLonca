using eLonca.Common.Models;
using eLonca.Domain.Entities;
using eLonca.Domain.Interfaces;
using MediatR; 

namespace eLonca.Application.Queries.ProductListQueries.GetAllProductListItem
{
    public class GetAllProductListItemsQueryHandler : IRequestHandler<GetAllProductListItemsQueryResponse, Result<List<ProductListItem>>>
    {
        private readonly IProductListRepository _productListRepository;

        public GetAllProductListItemsQueryHandler(IProductListRepository productListRepository)
        {
            _productListRepository = productListRepository;
        }

        public Task<Result<List<ProductListItem>>> Handle(GetAllProductListItemsQueryResponse request, CancellationToken cancellationToken)
        {
            return _productListRepository.GetProductListItem(request.ListId);
        }
    }
}
