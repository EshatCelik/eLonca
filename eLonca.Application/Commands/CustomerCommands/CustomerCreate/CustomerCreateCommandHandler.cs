using eLonca.Common.Models;
using eLonca.Domain.Entities;
using eLonca.Domain.Interfaces;
using MediatR;

namespace eLonca.Application.Commands.CustomerCommands.CustomerCreate
{
    public class CustomerCreateCommandHandler : IRequestHandler<CustomerCreateCommand, Result<Customer>>
    {
        private readonly ICustomerRepository _customerRepository;

        public CustomerCreateCommandHandler(ICustomerRepository customerRepository)
        {
            _customerRepository = customerRepository;
        }

        public async Task<Result<Customer>> Handle(CustomerCreateCommand request, CancellationToken cancellationToken)
        {
            var customer = new Customer()
            {
                FirstName = request.FirstName,
                LastName = request.LastName,
                StoreId = request.StoreId,
                CustomerCode = request.CustomerCode,
                Email = request.Email,
                Address = request.Address,
                TaxNumber = request.TaxNumber,
                CustomerType = request.CustomerType

            };

            var repsonse = await _customerRepository.CreateAsync(customer, cancellationToken);
            return repsonse;
        }
    }
}
