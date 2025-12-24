using eLonca.Common.Enums;
using eLonca.Common.Models;
using eLonca.Domain.Entities;
using MediatR;

namespace eLonca.Application.Commands.StockCommands.StockUpdate
{
    public class StockUpdateCommand:IRequest<Result<StockMovement>>
    {
        public Guid? StockId { get; set; }
        public Guid? StoreId { get; set; }
        public Guid? SaleId { get; set; }
        public Guid? ProductId { get; set; }
        public string ProductName{ get; set; }
        public MovementType MovementType { get; set; }
        public decimal Quantity { get; set; }
        public DateTime MovementDate { get; set; } = DateTime.UtcNow;
        public Guid? ReferenceId { get; set; }
        public string? Notes { get; set; }
    }
}
