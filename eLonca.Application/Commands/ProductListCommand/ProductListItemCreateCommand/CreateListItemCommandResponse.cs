using eLonca.Common.Models;
using eLonca.Domain.Entities;
using MediatR;

namespace eLonca.Application.Commands.ProductListCommand.ProductListItemCreateCommand
{
    public class CreateListItemCommandResponse :IRequest<Result<ProductListItem>>
    {
        public Guid ListId { get; set; }
        public string ProductName { get; set; }
        public decimal Price { get; set; }
        public decimal Discount { get; set; }
    }
}
