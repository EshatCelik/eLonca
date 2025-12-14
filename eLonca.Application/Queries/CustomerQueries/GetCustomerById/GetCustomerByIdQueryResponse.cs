using eLonca.Common.Models;
using eLonca.Domain.Entities;
using MediatR;

namespace eLonca.Application.Queries.UserQueries.GetUserById
{
    public class GetCustomerByIdQueryResponse:IRequest<Result<StoreCustomer>>
    {
        public Guid? Id { get; set; }
    }
}
