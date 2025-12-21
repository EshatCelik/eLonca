using eLonca.Common.Models;
using eLonca.Domain.Entities;
using eLonca.Domain.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace eLonca.Application.Commands.SaleItemCommand.UpdateSaleItem
{
    public class UpdateSaleItemCommandHandler : IRequestHandler<UpdateSaleItemCommandResponse, Result<SaleItem>>
    {
        private readonly ISaleRepository _saleRepository;

        public UpdateSaleItemCommandHandler(ISaleRepository saleRepository)
        {
            _saleRepository = saleRepository;
        }

        public async Task<Result<SaleItem>> Handle(UpdateSaleItemCommandResponse request, CancellationToken cancellationToken)
        {
            var sale = await _saleRepository.GetByIdAsync(request.SaleId);
            if (!sale.IsSuccess)
            {
                return Result<SaleItem>.Failure(sale.Errors, sale.Message, sale.StatusCode);
            }
            var saleItem = _saleRepository.GetAllSaleItemById(request.SaleId, cancellationToken).Result.Data.Where(x => x.ProductId == request.ProductId).FirstOrDefault();
            if (saleItem != null)
            {
                saleItem.Quantity = request.Quantity;
                saleItem.TotalPrice = request.Quantity * request.UnitPrice;
                var response = _saleRepository.Update(sale.Data, cancellationToken);
                return Result<SaleItem>.Success(saleItem, "Güncelleme başarılı", 200);
            }
            return Result<SaleItem>.Failure(null, "güncelleme başarısız", 400);

        }
    }
}
