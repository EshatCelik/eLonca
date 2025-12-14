using eLonca.Common.Models;
using eLonca.Domain.Entities;
using eLonca.Domain.Interfaces;
using MediatR;

namespace eLonca.Application.Queries.UserQueries.GetUserById
{
    public class GetCustomerByIdQueryHandler : IRequestHandler<GetCustomerByIdQueryResponse, Result<StoreCustomer>>
    {
        private readonly ICustomerRepository _customerRepository;

        public GetCustomerByIdQueryHandler(ICustomerRepository customerRepository)
        {
            _customerRepository = customerRepository;
        }

        public async Task<Result<StoreCustomer>> Handle(GetCustomerByIdQueryResponse request, CancellationToken cancellationToken)
        {
            var customer = await _customerRepository.GetByIdAsync(request.Id);
            if (!customer.IsSuccess)
            {
                return Result<StoreCustomer>.Failure(null, "Müşteri bulunamadı", 400);
            }
            return customer;
        }
    }
}
