using eLonca.Common.Models;
using eLonca.Domain.Entities;
using eLonca.Domain.Interfaces;
using MediatR;

namespace eLonca.Application.Queries.TenantQueries.GetAllTenant
{
    public class GetAllTenantQueries : IRequestHandler<GetAllTenantResponse, Result<List<Tenant>>>
    {
        private readonly ITenantRepository _tenantRepository;

        public GetAllTenantQueries(ITenantRepository tenantRepository)
        {
            _tenantRepository = tenantRepository;
        }

        public async Task<Result<List<Tenant>>> Handle(GetAllTenantResponse request, CancellationToken cancellationToken)
        {
            var response = await _tenantRepository.GetAllAsync(x => x.IsActive && x.IsDeleted == false, cancellationToken);
            return response;
        }
    }
}
