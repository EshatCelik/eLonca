using eLonca.Common.Models;
using eLonca.Domain.Entities;
using MediatR;

namespace eLonca.Application.Commands.UserCommands.UserDelete
{
    public class UserDeleteCommand:IRequest<Result<User>>
    {
        public Guid Id { get; set; }
    }
}
