using eLonca.Common.Enums;
using eLonca.Common.Models;
using eLonca.Domain.Entities;
using eLonca.Domain.Interfaces;
using MediatR;

namespace eLonca.Application.Commands.StockCommands.StockUpdate
{
    public class StockUpdateCommandHandler : IRequestHandler<StockUpdateCommand, Result<StockMovement>>
    {
        private readonly IStockRepository _stockRepository;

        public StockUpdateCommandHandler(IStockRepository stockRepository)
        {
            _stockRepository = stockRepository;
        }

        public async Task<Result<StockMovement>> Handle(StockUpdateCommand request, CancellationToken cancellationToken)
        {
            var findStock = _stockRepository.GetStockByProductId(request.StoreId, request.ProductId);
            if (!findStock.Result.IsSuccess)
            {
                return findStock.Result;
            }

            var updateStock = new StockMovement()
            {
                StoreId = request.StoreId,
                ProductId = request.ProductId,
                MovementType = MovementType.Adjustment,
                Quantity = request.Quantity,
                Notes = request.Note,
                MovementDate = DateTime.Now,
                CompanyId=request.CompanyId
            };

            var repsonse = await _stockRepository.CreateAsync(updateStock, cancellationToken);
            return repsonse;
        }
    }
}
