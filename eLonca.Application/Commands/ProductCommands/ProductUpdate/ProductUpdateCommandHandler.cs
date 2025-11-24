using eLonca.Common.Models;
using eLonca.Domain.Entities;
using eLonca.Domain.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace eLonca.Application.Commands.ProductCommands.ProductUpdate
{
    public class ProductUpdateCommandHandler : IRequestHandler<ProductUpdateCommand, Result<Product>>
    {
        private readonly IProductRepository _productRepository;

        public ProductUpdateCommandHandler(IProductRepository productRepository)
        {
            _productRepository = productRepository;
        }

        public async Task<Result<Product>> Handle(ProductUpdateCommand request, CancellationToken cancellationToken)
        {
            var product = await _productRepository.GetByIdAsync(request.ProductId);
            if (product == null) { return product; }

            product.Data.Barcode = request.Barcode;
            product.Data.CurrentStock = request.CurrentStock;
            product.Data.MinStockLevel = request.MinStockLevel;
            product.Data.CategoryId = request.CategoryId ?? Guid.Empty;
            product.Data.Description = request.Description;
            product.Data.ProductName = request.ProductName;
            product.Data.ProductCode = request.ProductCode;
            product.Data.SalePrice = request.SalePrice;
            product.Data.PurchasePrice = request.PurchasePrice;
            product.Data.Unit = request.Unit;

            var result = await _productRepository.Update(product.Data, cancellationToken);
            return result;

        }
    }
}
