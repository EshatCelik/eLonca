using eLonca.Common.Models;
using eLonca.Domain.Entities;
using MediatR; 

namespace eLonca.Application.Commands.ProductListCommand.ProductListCreateCommand
{
    public class CreateProductListCommandResponse : IRequest<Result<ProductList>>
    {
        public string ListName { get; set; }
        public string Description { get; set; }
        public DateTime LastPublishDate { get; set; }
        public Guid StoreId { get; set; }
    }
}
