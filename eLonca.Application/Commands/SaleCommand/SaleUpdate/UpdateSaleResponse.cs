using eLonca.Common.Models;
using eLonca.Domain.Entities;
using MediatR;

namespace eLonca.Application.Commands.SaleCommand.SaleUpdate
{
    public class UpdateSaleResponse :IRequest<Result<Sale>>
    {
        public Guid Id { get; set; }
        public Guid  ProductId { get; set; }
        public  int Count { get; set; }
        public List<SaleItem> SaleItems { get; set; }
    }
}
