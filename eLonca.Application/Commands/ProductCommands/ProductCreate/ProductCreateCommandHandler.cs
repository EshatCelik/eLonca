using eLonca.Common.Models;
using eLonca.Domain.Entities;
using eLonca.Domain.Interfaces;
using MediatR;

namespace eLonca.Application.Commands.ProductCommands.ProductCreate
{
    public class ProductCreateCommandHandler : IRequestHandler<ProductCreateCommand, Result<Product>>
    {
        private readonly IProductRepository _productRepository;
        public ProductCreateCommandHandler(IProductRepository productRepository = null)
        {
            _productRepository = productRepository;
        }
        public async Task<Result<Product>> Handle(ProductCreateCommand request, CancellationToken cancellationToken)
        {
            var product = new Product()
            {
                Barcode = request.Barcode,
                CategoryId = request.CategoryId,
                StoreId = request.StoreId,
                SalePrice = request.SalePrice,
                ProductCode = request.ProductCode,
                ProductName = request.ProductName,
                PurchasePrice = request.PurchasePrice,
                Unit = request.Unit,
                MinStockLevel = request.MinStockLevel,

            };

            var response = await _productRepository.CreateAsync(product, cancellationToken);
            return response;
        }
    }
}
