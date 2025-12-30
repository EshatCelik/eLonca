using eLonca.Common.Models;
using eLonca.Domain.Entities;
using eLonca.Domain.Interfaces;
using MediatR; 

namespace eLonca.Application.Commands.ProductListCommand.ProductListItemCreateCommand
{
    public class CreateListItemCommandHandler : IRequestHandler<CreateListItemCommandResponse, Result<ProductListItem>>
    { 
        private readonly IProductListItemRepository _productListItemRepository;
        private readonly IProductListRepository _productListRepository;

        public CreateListItemCommandHandler(IProductListItemRepository productListItemRepository, IProductListRepository productListRepository)
        {
            _productListItemRepository = productListItemRepository;
            _productListRepository = productListRepository;
        }

        public async Task<Result<ProductListItem>> Handle(CreateListItemCommandResponse request, CancellationToken cancellationToken)
        {
            var list = await _productListRepository.GetByIdAsync(request.ListId);
            if (!list.IsSuccess)
            {
                return Result<ProductListItem>.Failure(null, "Liste Bulunamadı", 400);
            }
            var item = new ProductListItem()
            {
                ProductListId = request.ListId,
                ProductName = request.ProductName,
                Price = request.Price
            };

            var response = await _productListItemRepository.CreateAsync(item, cancellationToken);
            return response;
        }
    }
}
