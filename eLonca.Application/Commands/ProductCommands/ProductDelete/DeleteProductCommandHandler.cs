using eLonca.Common.Models;
using eLonca.Domain.Entities;
using eLonca.Domain.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace eLonca.Application.Commands.ProductCommands.ProductDelete
{
    public class DeleteProductCommandHandler : IRequestHandler<DeleteProducCommand, Result<Product>>
    {
        private readonly IProductRepository _productRepository;
        private readonly IUnitOfWork _unitOfWork;

        public DeleteProductCommandHandler(IProductRepository productRepository, IUnitOfWork unitOfWork)
        {
            _productRepository = productRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Result<Product>> Handle(DeleteProducCommand request, CancellationToken cancellationToken)
        {
            var product = await _productRepository.GetByIdAsync(request.Id);
            if (!product.IsSuccess)
            {
                return Result<Product>.Failure(product.Errors, product.Message, product.StatusCode);
            }

            var delete=await _productRepository.DeleteAsync(product.Data,cancellationToken);
            if(!delete.IsSuccess)
            {
                return Result<Product>.Failure(null, "Ürün Silme Başarısız", 400);
            }
            _ = _unitOfWork.SaveChangeAsync();
            return Result<Product>.Success(product.Data, "Ürün Silme Başarılı", 200);
        }
    }
}
