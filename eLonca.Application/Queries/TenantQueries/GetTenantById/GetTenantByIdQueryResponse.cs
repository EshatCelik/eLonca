using eLonca.Common.Models;
using eLonca.Domain.Entities;
using MediatR;

namespace eLonca.Application.Queries.TenantQueries.GetTenantById
{
    public class GetTenantByIdQueryResponse :IRequest<Result<Tenant>>
    {
        public Guid Id { get; set; }
    }
}
