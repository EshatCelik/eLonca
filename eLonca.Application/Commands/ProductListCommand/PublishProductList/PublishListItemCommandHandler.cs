using eLonca.Common.Models;
using eLonca.Domain.Entities;
using eLonca.Domain.Interfaces;
using MediatR;

namespace eLonca.Application.Commands.ProductListCommand.PublishProductList
{
    public class PublishListItemCommandHandler : IRequestHandler<PublishListItemCommandResponse, Result<ProductList>>
    {
        private readonly IProductListRepository _productListRepository;

        public PublishListItemCommandHandler(IProductListRepository productListRepository)
        {
            _productListRepository = productListRepository;
        }

        public async Task<Result<ProductList>> Handle(PublishListItemCommandResponse request, CancellationToken cancellationToken)
        {
            var list = await _productListRepository.GetByIdAsync(request.ListId);
            if (!list.IsSuccess)
            {
                return list;
            }
            list.Data.IsPublish = request.IsPublish;

            var response = await _productListRepository.Update(list.Data, cancellationToken);
            return response;
        }
    }
}
