using eLonca.Common.Models;
using eLonca.Domain.Entities;
using MediatR;

namespace eLonca.Application.Queries.CustomerQueries.GetAllCustomer
{
    public class GetAllCustomerQueryResponse:IRequest<Result<List<StoreCustomer>>>
    {
        public Guid TenantId { get; set; }
    }
}
