using eLonca.Common.Models;
using eLonca.Domain.Entities;
using MediatR;

namespace eLonca.Application.Commands.CustomerCommands.CustomerDelete
{
    public class CustomerDeleteCommand :IRequest<Result<StoreCustomer>>
    {
        public Guid Id { get; set; }
    }
}
