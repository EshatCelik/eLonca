using eLonca.Common.Models;
using eLonca.Domain.Entities;
using MediatR;

namespace eLonca.Application.Commands.Tenants.CreateTenant
{
    public class CreateTenantCommand : IRequest<Result<Tenant>>
    {
        public string Name { get; set; }
        public string Subdomain { get; set; }
        public string ConnectionString { get; set; }
        public int Status { get; set; }
        public int TenantPlan { get; set; }
        public DateTime? SubscriptionEndDate { get; set; }
        public int MaxUser { get; set; }
        public int MaxStores { get; set; }
        public string LogoUrl { get; set; }
        public string? ContractEmail { get; set; }
        public string? ContractPhone { get; set; }
    }
}
