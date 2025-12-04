using eLonca.Application.Commands.Tenants.DeleteTenant;
using eLonca.Common.Models;
using eLonca.Domain.Entities;
using eLonca.Domain.Interfaces;
using MediatR;

namespace eLonca.Application.Commands.TenantsCommands.DeleteTenant
{
    public class TenantDeleteCommandHandler : IRequestHandler<TenantDeleteResponse, Result<Tenant>>
    {
        private readonly ITenantRepository _tenantRepository;

        public TenantDeleteCommandHandler(ITenantRepository tenantRepository)
        {
            _tenantRepository = tenantRepository;
        }

        public async Task<Result<Tenant>> Handle(TenantDeleteResponse request, CancellationToken cancellationToken)
        {
            var tenant = await _tenantRepository.GetByIdAsync(request.Id);
            if (!tenant.IsSuccess)
            {
                return Result<Tenant>.Failure(null, "Tenant Bulunamadı", 400);
            }
            var response = _tenantRepository.DeleteAsync(tenant.Data, cancellationToken);
            if (!response.IsCompleted)
            {
                return Result<Tenant>.Failure(null, "Tenant Silinemedi", 400);

            }
            return Result<Tenant>.Success(tenant.Data, "Tenant Silindi", 200);
        }
    }
}
