using eLonca.Common.Models;
using eLonca.Domain.Entities;
using MediatR;

namespace eLonca.Application.Commands.SaleItemCommand.UpdateSaleItemToReturn
{
    public class UpdateSaleItemToReturnCommandResponse :IRequest<Result<SaleItem>>
    {
        public Guid SaleId { get; set; }
        public Guid ProductId { get; set; }
        public string ReturnNote { get; set; }
    }
}
