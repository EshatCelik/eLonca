using eLonca.Common.Enums;
using eLonca.Common.Models;
using eLonca.Domain.Entities;
using eLonca.Domain.Interfaces;
using MediatR;

namespace eLonca.Application.Commands.SaleItemCommand.CreateSaleItem
{
    public class AddSaleItemCommandHandler : IRequestHandler<AddSaleItemCommandResponse, Result<Sale>>
    {
        private readonly ISaleRepository _saleRepository;

        public AddSaleItemCommandHandler(ISaleRepository saleRepository)
        {
            _saleRepository = saleRepository;
        }

        public async Task<Result<Sale>> Handle(AddSaleItemCommandResponse request, CancellationToken cancellationToken)
        {
            var sale = await _saleRepository.GetByIdAsync(request.SaleId);
            if (!sale.IsSuccess)
            {
                return Result<Sale>.Failure(sale.Errors, sale.Message, sale.StatusCode);
            }
            var saleItem =_saleRepository.GetAllSaleItemById(request.SaleId, cancellationToken).Result.Data.Where(x=>x.ProductId==request.ProductId).FirstOrDefault();
            if (saleItem == null)
            {
                var newSale = new SaleItem()
                {
                    ProductId = request.ProductId,
                    Quantity = request.Quantity,
                    UnitPrice = request.UnitPrice,
                    TotalPrice=request.Quantity * request.UnitPrice,
                    SaleType=SaleItemType.Sale,
                    

                };
                sale.Data.SaleItems.Add(newSale);
            }
            else
            {
                saleItem.Quantity += request.Quantity;
                saleItem.TotalPrice +=request.Quantity * request.UnitPrice;
                sale.Data.SaleItems.Add(saleItem);
            }

            var response = await _saleRepository.Update(sale.Data, cancellationToken);
            if (!response.IsSuccess)
            {
                return Result<Sale>.Failure(response.Errors, response.Message, response.StatusCode);

            }

            return Result<Sale>.Success(sale.Data, "Satışa ürün eklendi", 200);
        }
    }
}
