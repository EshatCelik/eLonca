using eLonca.Common.Models;
using eLonca.Domain.Entities;
using eLonca.Domain.Interfaces;
using MediatR; 

namespace eLonca.Application.Queries.ProductListQueries.GetProductListById
{
    public class GetProductListByIdQueryHandler : IRequestHandler<GetProductListByIdQueryResponse, Result<ProductList>>
    {
        private readonly IProductListRepository _productListRepository;

        public GetProductListByIdQueryHandler(IProductListRepository productListRepository)
        {
            _productListRepository = productListRepository;
        }

        public async Task<Result<ProductList>> Handle(GetProductListByIdQueryResponse request, CancellationToken cancellationToken)
        {
            var response = await _productListRepository.GetByIdAsync(request.Id);
            return response;
        }
    }
}
