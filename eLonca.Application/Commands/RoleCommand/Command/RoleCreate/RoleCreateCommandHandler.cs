using eLonca.Common.Models;
using eLonca.Domain.Entities;
using eLonca.Domain.Interfaces;
using MediatR;

namespace eLonca.Application.Commands.RoleCommand.Command.RoleCreate
{
    public class RoleCreateCommandHandler : IRequestHandler<RoleCreateCommandResponse, Result<Role>>
    {
        private readonly IRoleRepository _roleRepository;

        public RoleCreateCommandHandler(IRoleRepository roleRepository)
        {
            _roleRepository = roleRepository;
        }

        public async Task<Result<Role>> Handle(RoleCreateCommandResponse request, CancellationToken cancellationToken)
        {
            var check = await _roleRepository.GetRoleByCode(request.Code, request.StoreId);
            if (!check.IsSuccess)
            {
                return check;
            }
            var role = new Role()
            {
                RoleName = request.Name,
                RoleCode = request.Code.ToUpper(),
                StoreId = request.StoreId,
            };

            var response = await _roleRepository.CreateAsync(role, cancellationToken);
            return response;
        }
    }
}
