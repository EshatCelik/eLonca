using eLonca.Application.Services.TenantService;
using eLonca.Common.DTOs;
using eLonca.Common.Models;
using eLonca.Domain.Interfaces;
using MediatR;

namespace eLonca.Application.Queries.StockQueries.GetAllStockQuery
{
    public class GetAllStockQueryHandler : IRequestHandler<GetAllStockQuery, Result<List<StockMovementDto>>>
    {
        private readonly IStockRepository _stockRepository;
        private readonly ITenantService _tenantService;


        public GetAllStockQueryHandler(IStockRepository stockRepository, ITenantService tenantService)
        {
            _stockRepository = stockRepository;
            _tenantService = tenantService;
        }

        public async Task<Result<List<StockMovementDto>>> Handle(GetAllStockQuery request, CancellationToken cancellationToken)
        {
            var stock =   _stockRepository.GetAllStock( _tenantService.GetTenantId().Data).Result;
            return stock;
        }
    }
}
