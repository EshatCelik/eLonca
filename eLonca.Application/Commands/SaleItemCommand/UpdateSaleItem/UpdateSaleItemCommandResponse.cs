using eLonca.Common.Models;
using eLonca.Domain.Entities;
using MediatR;

namespace eLonca.Application.Commands.SaleItemCommand.UpdateSaleItem
{
    public class UpdateSaleItemCommandResponse :IRequest<Result<SaleItem>>
    {
        public Guid ProductId { get; set; }
        public int Quantity { get; set; }
        public Guid SaleId { get; set; }
        public decimal TotalPrice { get; set; }
        public decimal UnitPrice { get; set; }
    }
}
