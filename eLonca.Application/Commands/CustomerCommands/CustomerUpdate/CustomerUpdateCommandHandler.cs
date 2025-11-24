using eLonca.Common.Models;
using eLonca.Domain.Entities;
using eLonca.Domain.Interfaces;
using MediatR;

namespace eLonca.Application.Commands.CustomerCommands.CustomerCreate
{
    public class CustomerUpdateCommandHandler : IRequestHandler<CustomerUpdateCommand, Result<Customer>>
    {
        private readonly ICustomerRepository _customerRepository;

        public CustomerUpdateCommandHandler(ICustomerRepository customerRepository)
        {
            _customerRepository = customerRepository;
        }

        public async Task<Result<Customer>> Handle(CustomerUpdateCommand request, CancellationToken cancellationToken)
        {
            var customer = await _customerRepository.GetByIdAsync(request.Id);
            if (!customer.IsSuccess)
                return customer;

            customer.Data.Address = request.Address;
            customer.Data.FirstName = request.FirstName;
            customer.Data.LastName = request.LastName;
            customer.Data.PhoneNumber = request.PhoneNumber;
            customer.Data.TaxNumber = request.TaxNumber;
            customer.Data.Notes = request.Notes;
            customer.Data.Email= request.Email;
            customer.Data.CustomerCode = request.CustomerCode;
            customer.Data.CustomerType = request.CustomerType;

            var repsonse = await _customerRepository.Update(customer.Data, cancellationToken);
            return repsonse;
        }
    }
}
