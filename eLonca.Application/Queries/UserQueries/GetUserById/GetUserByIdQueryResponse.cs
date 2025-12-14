using eLonca.Common.Models;
using eLonca.Domain.Entities;
using MediatR;

namespace eLonca.Application.Queries.UserQueries.GetUserById
{
    public class GetUserByIdQueryResponse:IRequest<Result<User>>
    {
        public Guid? Id { get; set; }
    }
}
