using eLonca.Application.Services.TenantService;
using eLonca.Common.DTOs;
using eLonca.Common.Models;
using eLonca.Domain.Interfaces;
using MediatR;

namespace eLonca.Application.Queries.SalesQueries 
{
    public class GetAllCustomerSalesQueryHandler : IRequestHandler<GetAllCustomerSalesQueryResponse, Result<List<GetAllSalesDto>>>
    {
        private readonly ITenantService _tenantService;
        private readonly ISaleRepository _saleRepository;

        public GetAllCustomerSalesQueryHandler(ITenantService tenantService, ISaleRepository saleRepository)
        {
            _tenantService = tenantService;
            _saleRepository = saleRepository;
        }

        public async Task<Result<List<GetAllSalesDto>>> Handle(GetAllCustomerSalesQueryResponse request, CancellationToken cancellationToken)
        {
            var tenant = _tenantService.GetTenantId();
            if (!tenant.IsSuccess)
            {
                return Result<List<GetAllSalesDto>>.Failure(null, "Tenant bulunamadı", 400);
            }

            var sales = await _saleRepository.GetAllSales(request.StoreId,request.StoreCustomerId, cancellationToken);

            return Result<List<GetAllSalesDto>>.Success(sales.Data, "Satış Listesi", 200);
        }
    }
}
