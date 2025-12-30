using eLonca.Common.Models;
using eLonca.Domain.Entities;
using eLonca.Domain.Interfaces;
using MediatR;

namespace eLonca.Application.Queries.DashboardQueries.GetAllPublishList
{
    public class GetAllPublishListQueryHandler : IRequestHandler<GetAllPublishListQueryResponse, Result<List<ProductList>>>
    {
        private readonly IProductListRepository _productListRepository;

        public GetAllPublishListQueryHandler(IProductListRepository productListRepository)
        {
            _productListRepository = productListRepository;
        }

        public async Task<Result<List<ProductList>>> Handle(GetAllPublishListQueryResponse request, CancellationToken cancellationToken)
        {
            var list = await _productListRepository.GetAllPublishProductListForDashboard();
            return list;
        }
    }
}
