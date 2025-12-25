using eLonca.Common.Models;
using MediatR;

namespace eLonca.Application.Commands.StockCommands.StockDelete
{
    public class StockDeleteCommand:IRequest<Result>
    {
        public Guid ProductId { get; set; }
        public Guid StoreId { get; set; }
        public string Note { get; set; }
        public int Quantity { get; set; }
    }
}
