using eLonca.Application.DTOs;
using eLonca.Common.DTOs;
using eLonca.Common.Models;
using eLonca.Domain.Interfaces;
using MediatR;

namespace eLonca.Application.Queries.StockQueries.GetAllProductStockMovement
{
    internal class GetAllProductStockMovementQueryHandler : IRequestHandler<GetAllProductStockMovementQueryResponse, Result<List<StockMovementDto>>>
    {
        private readonly IStockRepository _stockRepository;

        public GetAllProductStockMovementQueryHandler(IStockRepository stockRepository)
        {
            _stockRepository = stockRepository;
        }

        public async Task<Result<List<StockMovementDto>>> Handle(GetAllProductStockMovementQueryResponse request, CancellationToken cancellationToken)
        {
            var stocks = await _stockRepository.GetAllStockByProductId(request.StoreId, request.ProductId);
            if (!stocks.IsSuccess)
            {
                return Result<List<StockMovementDto>>.Failure(null, "stok bulunamadı", 400);
            }
            return Result<List<StockMovementDto>>.Success(stocks.Data, "Liste başarılı", 200);
        }
    }
}
