using eLonca.Common.DTOs;
using eLonca.Common.Models; 
using MediatR;

namespace eLonca.Application.Queries.CustomerQueries.GetAllCustomer
{
    public class GetAllCustomerQueryResponse:IRequest<Result<List<StoreCustomerDto>>>
    {
        public Guid TenantId { get; set; }
    }
}
