using eLonca.Common.Models;
using eLonca.Domain.Entities;

using MediatR;

namespace eLonca.Application.Commands.RoleCommand.Command.RoleCreate
{
    public class RoleCreateCommandResponse :IRequest<Result<Role>>
    {
        public string Code { get; set; }
        public string Name { get; set; }
        public Guid StoreId { get; set; }
    }
}
