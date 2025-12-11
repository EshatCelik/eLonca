using eLonca.Application.Services.TenantService;
using eLonca.Common.Models;
using eLonca.Domain.Entities;
using eLonca.Domain.Interfaces;
using MediatR;

namespace eLonca.Application.Queries.StockQueries.GetAllStockQuery
{
    public class GetAllStockQueryHandler : IRequestHandler<GetAllStockQuery, Result<List<StockMovement>>>
    {
        private readonly IStockRepository _stockRepository;
        private readonly ITenantService _tenantService;


        public GetAllStockQueryHandler(IStockRepository stockRepository, ITenantService tenantService)
        {
            _stockRepository = stockRepository;
            _tenantService = tenantService;
        }

        public async Task<Result<List<StockMovement>>> Handle(GetAllStockQuery request, CancellationToken cancellationToken)
        {
            var stock = await _stockRepository.GetAllAsync(x => x.TenantId == _tenantService.GetTenantId().Data, cancellationToken);
            return stock;
        }
    }
}
