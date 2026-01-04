using eLonca.Common.Models;
using eLonca.Domain.Entities;
using eLonca.Domain.Interfaces;
using MediatR;
using System.Collections.Generic;

namespace eLonca.Application.Commands.SaleItemCommand.CreateReturnSaleItem
{
    public class AddReturnItemToSaleCommandHandler : IRequestHandler<AddReturnItemToSaleCommandResponse, Result<Sale>>
    {

        private readonly ISaleRepository _saleRepository;

        public AddReturnItemToSaleCommandHandler(ISaleRepository saleRepository)
        {
            _saleRepository = saleRepository;
        }
        public async Task<Result<Sale>> Handle(AddReturnItemToSaleCommandResponse request, CancellationToken cancellationToken)
        {
            var sale = await _saleRepository.GetByIdAsync(request.SaleId);
            if (!sale.IsSuccess)
            {
                return Result<Sale>.Failure(sale.Errors, sale.Message, sale.StatusCode);
            }


            var response = await _saleRepository.AddReturnItemToSale(request.ReturnItems, sale.Data, cancellationToken);
            if (!response.IsSuccess)
                return response;

            var update = await _saleRepository.Update(response.Data, cancellationToken);

            return update;
        }
    }
}
