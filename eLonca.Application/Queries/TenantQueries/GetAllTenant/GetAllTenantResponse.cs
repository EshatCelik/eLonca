using eLonca.Common.Models;
using eLonca.Domain.Entities;
using MediatR;

namespace eLonca.Application.Queries.TenantQueries.GetAllTenant
{
    public class GetAllTenantResponse : IRequest<Result<List<Tenant>>>
    {
    }
}
