using eLonca.Common;
using eLonca.Domain.Entities.BaseEntities; 

namespace eLonca.Domain.Entities
{
    public class Payment : TenantBaseEntity
    {
        public DateTime PaymentDate { get; set; } = DateTime.UtcNow;
        public decimal Amount { get; set; }
        public PaymentMethod PaymentMethod { get; set; }
        public string? ReferenceNumber { get; set; }
        public string? Notes { get; set; }

        // Navigation
        public Guid SaleId { get; set; }
        public Sale Sale { get; set; } = null!; 
        public Tenant Tenant { get; set; } = null!;
        public Guid CustomerId { get; set; }
        public StoreCustomer Customer { get; set; } = null!;
    }
}
