

using eLonca.Application.Commands.SaleItemCommand.UpdateSaleItemToReturn;
using eLonca.Common.Models;
using eLonca.Domain.Entities;
using eLonca.Domain.Interfaces;
using MediatR;

namespace eLonca.Application.Commands.SaleItemCommand.UptadeSaleItemToReturn
{
    public class UpdateSaleItemToReturnCommandHandler : IRequestHandler<UpdateSaleItemToReturnCommandResponse, Result<SaleItem>>
    {
        private readonly ISaleRepository _saleRepository;

        public UpdateSaleItemToReturnCommandHandler(ISaleRepository saleRepository)
        {
            _saleRepository = saleRepository;
        }

        public async Task<Result<SaleItem>> Handle(UpdateSaleItemToReturnCommandResponse request, CancellationToken cancellationToken)
        {
            var sale = await _saleRepository.GetByIdAsync(request.SaleId);
            if (!sale.IsSuccess)
            {
                return Result<SaleItem>.Failure(sale.Errors, sale.Message, sale.StatusCode);
            }
            var saleItem = _saleRepository.GetAllSaleItemById(request.SaleId, cancellationToken).Result.Data.Where(x => x.ProductId == request.ProductId).FirstOrDefault();
            if (saleItem != null)
            {
                saleItem.Quantity -= request.returnQuantity;
                saleItem.ReturnedQuantity += request.returnQuantity;
                saleItem.TotalPrice = saleItem.Quantity * saleItem.UnitPrice;
                var response = _saleRepository.Update(sale.Data, cancellationToken);
                return Result<SaleItem>.Success(saleItem, "Güncelleme başarılı", 200);
            }
            return Result<SaleItem>.Failure(null, "güncelleme başarısız", 400);
        }
    }
}
