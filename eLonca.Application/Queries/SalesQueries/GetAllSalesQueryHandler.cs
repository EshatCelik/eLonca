using eLonca.Application.Services.TenantService;
using eLonca.Common.Models;
using eLonca.Domain.Entities;
using eLonca.Domain.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace eLonca.Application.Queries.SalesQueries
{
    public class GetAllSalesQueryHandler : IRequestHandler<GetAllSalesQueryResponse, Result<List<Sale>>>
    {
        private readonly ITenantService _tenantService;
        private readonly ISaleRepository _saleRepository;

        public GetAllSalesQueryHandler(ITenantService tenantService, ISaleRepository saleRepository)
        {
            _tenantService = tenantService;
            _saleRepository = saleRepository;
        }

        public async Task<Result<List<Sale>>> Handle(GetAllSalesQueryResponse request, CancellationToken cancellationToken)
        {
            var tenant = _tenantService.GetTenantId();
            if (!tenant.IsSuccess)
            {
                return Result<List<Sale>>.Failure(null, "Tenant bulunamadı", 400);
            }

            var sales = await _saleRepository.GetAllSales(tenant.Data, cancellationToken);

            return Result<List<Sale>>.Success(sales.Data, "Satış Listesi", 200);
        }
    }
}
