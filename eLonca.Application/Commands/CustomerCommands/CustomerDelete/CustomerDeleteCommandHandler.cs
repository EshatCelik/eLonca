using eLonca.Common.Models;
using eLonca.Domain.Entities;
using eLonca.Domain.Interfaces;
using MediatR;

namespace eLonca.Application.Commands.CustomerCommands.CustomerDelete
{
    public class CustomerDeleteCommandHandler : IRequestHandler<CustomerDeleteCommand, Result<StoreCustomer>>
    {
        private readonly ICustomerRepository _customerRepository;

        public CustomerDeleteCommandHandler(ICustomerRepository customerRepository)
        {
            _customerRepository = customerRepository;
        }

        public async Task<Result<StoreCustomer>> Handle(CustomerDeleteCommand request, CancellationToken cancellationToken)
        {
            var customer = await _customerRepository.GetByIdAsync(request.Id);
            if (!customer.IsSuccess)
            {
                return Result<StoreCustomer>.Failure(customer.Errors, customer.Message, customer.StatusCode);
            }
            var updateCustomer = customer.Data;
            updateCustomer.IsActive = false;

            var result = await _customerRepository.Update(updateCustomer, cancellationToken);
            return result;
        }
    }
}
