using eLonca.Common;
using eLonca.Common.Models;
using eLonca.Domain.Entities;
using MediatR;

namespace eLonca.Application.Commands.CustomerCommands.CustomerCreate
{
    public class CustomerUpdateCommand : IRequest<Result<StoreCustomer>>
    {
        public string CustomerCode { get; set; } = string.Empty;  
        public int DiscountRate { get; set; }
        public int CustomerType { get; set; }  
        public Guid Id { get; set; } 
        public Guid? StoreId { get; set; }
    }
}
