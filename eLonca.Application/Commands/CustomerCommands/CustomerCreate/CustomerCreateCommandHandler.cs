using eLonca.Common.Models;
using eLonca.Domain.Entities;
using eLonca.Domain.Interfaces;
using MediatR;

namespace eLonca.Application.Commands.CustomerCommands.CustomerCreate
{
    public class CustomerCreateCommandHandler : IRequestHandler<CustomerCreateCommand, Result<StoreCustomer>>
    {
        private readonly ICustomerRepository _customerRepository;

        public CustomerCreateCommandHandler(ICustomerRepository customerRepository)
        {
            _customerRepository = customerRepository;
        }

        public async Task<Result<StoreCustomer>> Handle(CustomerCreateCommand request, CancellationToken cancellationToken)
        {
            var customer = new StoreCustomer()
            {
                FirstName = request.FirstName,
                LastName = request.LastName,
                StoreId = request.StoreId,
                CustomerStoreId = request.CustomerStoreId,
                DiscountRate = request.DiscountRate,
                PhoneNumber = request.PhoneNumber,
                Notes = request.Notes,                
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
