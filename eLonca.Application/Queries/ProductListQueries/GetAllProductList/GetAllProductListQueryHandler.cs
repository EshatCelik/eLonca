using eLonca.Common.Models;
using eLonca.Domain.Entities;
using eLonca.Domain.Interfaces;
using MediatR; 

namespace eLonca.Application.Queries.ProductListQueries.GetAllProductList
{
    public class GetAllProductListQueryHandler : IRequestHandler<GetAllProductListQueryResponse, Result<List<ProductList>>>
    {
        private readonly IProductListRepository _productListRepository;

        public GetAllProductListQueryHandler(IProductListRepository productListRepository)
        {
            _productListRepository = productListRepository;
        }

        public async Task<Result<List<ProductList>>> Handle(GetAllProductListQueryResponse request, CancellationToken cancellationToken)
        {
            var list = await _productListRepository.GetAllAsync(x => x.StoreId == request.StoreId && x.TenantId == request.TenantId, cancellationToken);
            return list;
        }
    }
}
