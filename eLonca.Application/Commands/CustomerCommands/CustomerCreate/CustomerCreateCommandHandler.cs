using eLonca.Common;
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
            var isAdded = _customerRepository.CheckIsAddedCustomer(request.StoreId, request.CustomerStoreId, cancellationToken);
            if (!isAdded.Result.IsSuccess)
            {
                return isAdded.Result;
            }
            var customer = new StoreCustomer()
            { 
                StoreId = request.StoreId,
                CustomerStoreId = request.CustomerStoreId,
                DiscountRate = request.DiscountRate, 
                CustomerCode = request.CustomerCode,
                CustomerType = Enum.Parse<CustomerType>(request.CustomerType == null ? request.CustomerType : CustomerType.Corporate.ToString())

            };

            var repsonse = await _customerRepository.CreateAsync(customer, cancellationToken);
            return repsonse;
        }
    }
}
