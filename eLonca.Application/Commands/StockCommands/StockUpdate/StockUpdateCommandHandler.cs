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

        public Task<Result<StockMovement>> Handle(StockUpdateCommand request, CancellationToken cancellationToken)
        {
            var findStock = _stockRepository.GetStockByProductId(request.StockId, request.ProductId);
            if (!findStock.Result.IsSuccess)
            {
                return findStock;
            }
            findStock.Result.Data.ProductId = request.ProductId;
            findStock.Result.Data.MovementDate = DateTime.Now;
            findStock.Result.Data.MovementType = request.MovementType;
            findStock.Result.Data.SaleId = request.SaleId ?? null;
            findStock.Result.Data.ReferenceId = request.ReferenceId;
            findStock.Result.Data.StoreId = request.StoreId;
            findStock.Result.Data.Quantity = request.Quantity;
            findStock.Result.Data.Notes = request.Notes;

            _ = _stockRepository.Update(findStock.Result.Data, cancellationToken);
            return findStock;
        }
    }
}
