using eLonca.Common;
using eLonca.Common.Models;
using eLonca.Domain.Entities;
using eLonca.Domain.Interfaces;
using MediatR;

namespace eLonca.Application.Commands.CustomerCommands.CustomerCreate
{
    public class CustomerUpdateCommandHandler : IRequestHandler<CustomerUpdateCommand, Result<StoreCustomer>>
    {
        private readonly ICustomerRepository _customerRepository;
        private readonly IStoreRepository _storeRepository;

        public CustomerUpdateCommandHandler(ICustomerRepository customerRepository, IStoreRepository storeRepository)
        {
            _customerRepository = customerRepository;
            _storeRepository = storeRepository;
        }

        public async Task<Result<StoreCustomer>> Handle(CustomerUpdateCommand request, CancellationToken cancellationToken)
        {
            var customer = await _customerRepository.GetByIdAsync(request.Id);
            if (!customer.IsSuccess)
                return customer;

            customer.Data.CustomerCode = request.CustomerCode;
            customer.Data.CustomerType = (CustomerType)request.CustomerType;
            customer.Data.DiscountRate = request.DiscountRate; 

            var repsonse = await _customerRepository.Update(customer.Data, cancellationToken);
            return repsonse;
        }
    }
}
