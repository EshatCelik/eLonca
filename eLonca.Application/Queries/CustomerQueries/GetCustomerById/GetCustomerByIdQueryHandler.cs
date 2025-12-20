using eLonca.Common.DTOs;
using eLonca.Common.Models;
using eLonca.Domain.Interfaces;
using MediatR;

namespace eLonca.Application.Queries.UserQueries.GetUserById
{
    public class GetCustomerByIdQueryHandler : IRequestHandler<GetCustomerByIdQueryResponse, Result<StoreCustomerDto>>
    {
        private readonly ICustomerRepository _customerRepository;

        public GetCustomerByIdQueryHandler(ICustomerRepository customerRepository)
        {
            _customerRepository = customerRepository;
        }

        public async Task<Result<StoreCustomerDto>> Handle(GetCustomerByIdQueryResponse request, CancellationToken cancellationToken)
        {
            var customer = await _customerRepository.GetByIdStoreCustomer(  request.Id, cancellationToken);
            if (!customer.IsSuccess)
            {
                return Result<StoreCustomerDto>.Failure(null, "Müşteri bulunamadı", 400);
            }
            return Result<StoreCustomerDto>.Success(customer.Data, "Mağaza müşterisi", 200);
        }
    }
}
