using eLonca.Common.Enums;
using eLonca.Common.Models;
using eLonca.Domain.Entities;
using MediatR;

namespace eLonca.Application.Commands.StockCommands.StockCreate
{
    public class StockCreateCommand:IRequest<Result<StockMovement>>
    {
        public Guid? StoreId { get; set; }
        public Guid? ProductId { get; set; }  
        public Guid? CompanyId { get; set; }  
        public decimal Quantity { get; set; }
        public string ProductName { get; set; }
    }
}
