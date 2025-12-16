using eLonca.Common.Models;
using eLonca.Domain.Entities;
using MediatR;

namespace eLonca.Application.Commands.ProductCommands.ProductDelete
{
    public class DeleteProducCommand:IRequest<Result<Product>>
    {
        public Guid Id { get; set; }
    }
}
