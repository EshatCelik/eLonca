using eLonca.Common.Models;
using eLonca.Domain.Entities;
using MediatR;

namespace eLonca.Application.Queries.UserQueries.GetAllUser
{
    public class GetAllUserQueryResponse:IRequest<Result<List<User>>>
    {
        public Guid? TenantId { get; set; }
    }
}
