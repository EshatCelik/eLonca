using eLonca.Common.DTOs;
using eLonca.Common.DTOs.SaleItem;
using eLonca.Common.Models;
using eLonca.Domain.Entities;
using MediatR; 

namespace eLonca.Application.Commands.SaleItemCommand.CreateReturnSaleItem
{
    public class AddReturnItemToSaleCommandResponse :IRequest<Result<Sale>>
    {
        public Guid  SaleId { get; set; }
        public List<ReturnSaleItemDto> ReturnItems { get; set; }
    }
}
