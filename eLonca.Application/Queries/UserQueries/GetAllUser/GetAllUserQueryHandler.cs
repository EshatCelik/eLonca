using eLonca.Application.Services.TenantService;
using eLonca.Common.Models;
using eLonca.Domain.Entities;
using eLonca.Domain.Interfaces;
using MediatR;

namespace eLonca.Application.Queries.UserQueries.GetAllUser
{
    public class GetAllUserQueryHandler : IRequestHandler<GetAllUserQueryResponse, Result<List<User>>>
    {
        private readonly ITenantService _tenantService;
        public readonly IUserRepository _userRepository;

        public GetAllUserQueryHandler(ITenantService tenantService, IUserRepository userRepository)
        {
            _tenantService = tenantService;
            _userRepository = userRepository;
        }

        public async Task<Result<List<User>>> Handle(GetAllUserQueryResponse request, CancellationToken cancellationToken)
        {
            var tenant = _tenantService.GetTenantId();
            if (!tenant.IsSuccess)
            {
                return Result<List<User>>.Failure(null, "Tenant bulunamadı", 400);
            }
            var users = await _userRepository.GetAllAsync(x => x.TenantId == tenant.Data, cancellationToken);
            return Result<List<User>>.Success(users.Data, "Tenant bulunamadı", 400);

        }
    }
}
