using eLonca.Common.Models;
using eLonca.Domain.Interfaces;
using MediatR;

namespace eLonca.Application.Commands.StockCommands.StockDelete
{
    public class StockDeleteCommandHandler : IRequestHandler<StockDeleteCommand, Result>
    {
        private readonly IStockRepository _stockRepository;

        public StockDeleteCommandHandler(IStockRepository stockRepository)
        {
            _stockRepository = stockRepository;
        }

        public async Task<Result> Handle(StockDeleteCommand request, CancellationToken cancellationToken)
        {
            var stock = _stockRepository.GetByIdAsync(request.ProductId);
            if (!stock.Result.IsSuccess)
            {
                return Result.Failure("Stok bulunamadı", null, 400);
            }
            var response = await _stockRepository.DeleteAsync(stock.Result.Data, cancellationToken);
            return response;
        }
    }
}
