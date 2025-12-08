using eLonca.Common.Models;
using eLonca.Domain.Entities;
using MediatR;

namespace eLonca.Application.Commands.Tenants.DeleteTenant
{
    public class TenantDeleteResponse:IRequest<Result<Tenant>>
    {
        public Guid Id { get; set; }
    }
}
