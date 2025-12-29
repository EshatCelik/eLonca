using eLonca.Common.Models;
using eLonca.Domain.Entities;
using eLonca.Domain.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace eLonca.Application.Queries.ProductQueries.GetProductById
{
    public class GetProductByIdQueryHandler : IRequestHandler<GetProductByIdQueryResponse, Result<ProductList>>
    {
        private readonly IProductListRepository _productRepository;

        public GetProductByIdQueryHandler(IProductListRepository productRepository)
        {
            _productRepository = productRepository;
        }

        public async Task<Result<ProductList>> Handle(GetProductByIdQueryResponse request, CancellationToken cancellationToken)
        {
            var product = await _productRepository.GetByIdAsync(request.Id);
            if (!product.IsSuccess)
            {
                return Result<ProductList>.Failure(product.Errors, product.Message, product.StatusCode);
            }
            return Result<ProductList>.Success(product.Data, product.Message, product.StatusCode);

        }
    }
}
