using eLonca.Domain.Entities.BaseEntities; 

namespace eLonca.Domain.Entities
{
    public class CustomerAccount : TenantBaseEntity
    {
        public decimal TotalDebt { get; set; }
        public decimal CreditLimit { get; set; }
        public DateTime? LastTransactionDate { get; set; }

        // Navigation 
        public Tenant Tenant { get; set; } = null!;
        public Guid CustomerId { get; set; }
        public Customer Customer { get; set; } = null!;
    }
}
