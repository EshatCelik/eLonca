using eLonca.Common.DTOs.Role;
using eLonca.Common.Models;
using eLonca.Domain.Interfaces;
using MediatR;

namespace eLonca.Application.Queries.RoleQueries.GetAllRole
{
    public class GetAllRoleQueryHandler : IRequestHandler<GetAllRoleQueryResponse, Result<List<GetAllRoleDto>>>
    {
        private readonly IRoleRepository _roleRepository;

        public GetAllRoleQueryHandler(IRoleRepository roleRepository)
        {
            _roleRepository = roleRepository;
        }

        public async Task<Result<List<GetAllRoleDto>>> Handle(GetAllRoleQueryResponse request, CancellationToken cancellationToken)
        {
            var list = _roleRepository.GetAllAsync(x => x.StoreId == request.StoreId).Result.Data
                .Select(x => new GetAllRoleDto()
                {
                    Code = x.RoleCode,
                    Name = x.RoleCode,
                    StoreId = x.StoreId,
                });

            return Result<List<GetAllRoleDto>>.Success(list.ToList(), "liste Başarılı", 200);
        }
    }
}
