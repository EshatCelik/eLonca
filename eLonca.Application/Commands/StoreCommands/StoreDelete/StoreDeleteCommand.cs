using eLonca.Common.Models;
using eLonca.Domain.Entities;
using MediatR;

namespace eLonca.Application.Commands.StoreCommands.StoreDelete
{
    public class StoreDeleteCommand:IRequest<Result<Store>>
    {
        public Guid Id { get; set; } 
    }
}
