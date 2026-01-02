using eLonca.Common.Enums;
using eLonca.Common.Models;
using eLonca.Domain.Entities;
using eLonca.Domain.Interfaces;
using MediatR;

namespace eLonca.Application.Commands.StockCommands.StockCreate
{
    internal class StockCreateCommandHandler : IRequestHandler<StockCreateCommand, Result<StockMovement>>
    {
        private readonly IStockRepository _stockRepository;

        public StockCreateCommandHandler(IStockRepository stockRepository)
        {
            _stockRepository = stockRepository;
        }

        public async Task<Result<StockMovement>> Handle(StockCreateCommand request, CancellationToken cancellationToken)
        {
            var updateStock = new StockMovement()
            {
                StoreId = request.StoreId,
                ProductId = request.ProductId,
                MovementType = MovementType.In,
                Quantity = request.Quantity,
                Notes = $"{request.ProductName } Eklendi",
                MovementDate = DateTime.Now,
                CompanyId=request.CompanyId
            };

            var repsonse = await _stockRepository.CreateAsync(updateStock, cancellationToken);
            return repsonse;
        }
    }
}
