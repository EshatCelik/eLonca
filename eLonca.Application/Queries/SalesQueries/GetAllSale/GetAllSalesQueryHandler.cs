using eLonca.Application.Services.TenantService;
using eLonca.Common.DTOs;
using eLonca.Common.Models;
using eLonca.Domain.Entities;
using eLonca.Domain.Interfaces;
using MediatR;

namespace eLonca.Application.Queries.SalesQueries.GetAllSale
{
    public class GetAllSalesQueryHandler : IRequestHandler<GetAllSalesQueryResponse, Result<List<GetAllSalesDto>>>
    {
        private readonly ITenantService _tenantService;
        private readonly ISaleRepository _saleRepository;

        public GetAllSalesQueryHandler(ITenantService tenantService, ISaleRepository saleRepository)
        {
            _tenantService = tenantService;
            _saleRepository = saleRepository;
        }

        public async Task<Result<List<GetAllSalesDto>>> Handle(GetAllSalesQueryResponse request, CancellationToken cancellationToken)
        {
            var tenant = _tenantService.GetTenantId();
            if (!tenant.IsSuccess)
            {
                return Result<List<GetAllSalesDto>>.Failure(null, "Tenant bulunamadı", 400);
            }

            var sales = await _saleRepository.GetAllSales(tenant.Data, cancellationToken);

            return Result<List<GetAllSalesDto>>.Success(sales.Data, "Satış Listesi", 200);
        }
    }
}
