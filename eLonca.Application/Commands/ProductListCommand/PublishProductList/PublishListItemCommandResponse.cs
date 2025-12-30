using eLonca.Common.Models;
using eLonca.Domain.Entities;
using MediatR;

namespace eLonca.Application.Commands.ProductListCommand.PublishProductList
{
    public class PublishListItemCommandResponse :IRequest<Result<ProductList>>
    {
        public Guid ListId { get; set; }
        public bool IsPublish { get; set; }
    }
}
