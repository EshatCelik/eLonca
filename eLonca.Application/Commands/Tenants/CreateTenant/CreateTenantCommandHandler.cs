using eLonca.Common.Models;
using eLonca.Domain.Entities;
using eLonca.Domain.Interfaces;
using MediatR;

namespace eLonca.Application.Commands.Tenants.CreateTenant
{
    public class CreateTenantCommandHandler : IRequestHandler<CreateTenantCommand, Result<Tenant>>
    {
        private readonly ITenantRepository _tenantRepository;
        private readonly IUnitOfWork _unitOfWork;

        public CreateTenantCommandHandler(ITenantRepository tenantRepository, IUnitOfWork unitOfWork)
        {
            _tenantRepository = tenantRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Result<Tenant>> Handle(CreateTenantCommand request, CancellationToken cancellationToken)
        {
            var isExist = await _tenantRepository.IsExistTenantByName(request.Name, cancellationToken);
            if (!isExist.IsSuccess)
                return Result<Tenant>.Failure(null, "Tenant Daha önce kaydedilmiş", 200);
            var tenant = new Tenant()
            {
                ConnectionString = request.ConnectionString,
                Status = (TenantStatus)request.Status,
                Subdomain = request.Subdomain,
                SubscriptionEndDate = request.SubscriptionEndDate,
                ContractEmail = request.ContractEmail,
                ContractPhone = request.ContractPhone,
                LogoUrl = request.LogoUrl,
                MaxStores = request.MaxStores,
                MaxUser = request.MaxUser,
                Name = request.Name,
                TenantPlan = (TenantPlan)request.TenantPlan,
                IsActive = true,

            };
            var result = await _tenantRepository.CreateAsync(tenant, cancellationToken);
            await _unitOfWork.SaveChangeAsync(cancellationToken);
            return result;
        }
    }
}
