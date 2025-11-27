using eLonca.Common;
using eLonca.Common.Models;
using eLonca.Domain.Entities;
using MediatR;

namespace eLonca.Application.Commands.CustomerCommands.CustomerCreate
{
    public class CustomerCreateCommand : IRequest<Result<StoreCustomer>>
    {
        public string CustomerCode { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string? PhoneNumber { get; set; }
        public string? Email { get; set; }
        public string? Address { get; set; }
        public CustomerType CustomerType { get; set; }
        public string? TaxNumber { get; set; }
        public string? Notes { get; set; }
        public int DiscountRate { get; set; }

        // Navigation: Ana mağaza
        public Guid StoreId { get; set; } 

        // Navigation: Müşteri olan mağaza
        public Guid CustomerStoreId { get; set; }
    }
}
