using eLonca.Common.DTOs.Role;
using eLonca.Common.Models; 
using MediatR;

namespace eLonca.Application.Queries.RoleQueries.GetAllRole
{
    public class GetAllRoleQueryResponse :IRequest<Result<List<GetAllRoleDto>>>
    {
        public Guid StoreId { get; set; }

    }
}
