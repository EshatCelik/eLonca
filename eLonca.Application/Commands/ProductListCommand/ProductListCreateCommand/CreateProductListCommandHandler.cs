using eLonca.Common.Models;
using eLonca.Domain.Entities;
using eLonca.Domain.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace eLonca.Application.Commands.ProductListCommand.ProductListCreateCommand
{
    public class CreateProductListCommandHandler : IRequestHandler<CreateProductListCommandResponse, Result<ProductList>>
    {
        private readonly IProductListRepository _productListRepository;

        public CreateProductListCommandHandler(IProductListRepository productListRepository)
        {
            _productListRepository = productListRepository;
        }

        public async Task<Result<ProductList>> Handle(CreateProductListCommandResponse request, CancellationToken cancellationToken)
        {
            var checkName = await _productListRepository.CheckName(request.ListName, request.StoreId);
            if (!checkName.IsSuccess)
            {
                return checkName;
            }
            var addList = new ProductList()
            {
                Name = request.ListName,
                Description = request.Description,
                LastPublishDate = request.LastPublishDate,
                StoreId = request.StoreId,

            };
            var response = await _productListRepository.CreateAsync(addList,cancellationToken);
            return response;
        }
    }
}
