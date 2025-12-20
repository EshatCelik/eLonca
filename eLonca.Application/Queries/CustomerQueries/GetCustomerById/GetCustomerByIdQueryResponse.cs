using eLonca.Common.DTOs;
using eLonca.Common.Models;
using eLonca.Domain.Entities;
using MediatR;

namespace eLonca.Application.Queries.UserQueries.GetUserById
{
    public class GetCustomerByIdQueryResponse:IRequest<Result<StoreCustomerDto>>
    {
        public Guid Id { get; set; }
        public Guid StoreId { get; set; }
        public Guid StoreCustomerId { get; set; }
    }
}
