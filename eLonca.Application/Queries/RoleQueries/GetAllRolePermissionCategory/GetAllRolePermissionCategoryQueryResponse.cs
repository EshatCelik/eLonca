

using eLonca.Common.DTOs.Role;
using eLonca.Common.Models;
using MediatR;

namespace eLonca.Application.Queries.RoleQueries.GetAllRolePermissionCategory
{
    public class GetAllRolePermissionCategoryQueryResponse : IRequest<Result<List<GetAllRolePermissionCategoryDto>>>
    {
    }
}
