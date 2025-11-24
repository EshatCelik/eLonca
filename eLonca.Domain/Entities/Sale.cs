using eLonca.Domain.Entities.BaseEntities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace eLonca.Domain.Entities
{
    public class Sale : TenantBaseEntity
    {
        public Guid? StoreId { get; set; }
        public Guid? CustomerId { get; set; }
        public DateTime SaleDate { get; set; } = DateTime.UtcNow;
        public string InvoiceNumber { get; set; } = string.Empty;
        public decimal? TotalAmount { get; set; }
        public decimal? PaidAmount { get; set; }
        public decimal   RemainingAmount { get; set; }
        public PaymentType PaymentType { get; set; }
        public PaymentStatus PaymentStatus { get; set; }
        public string? Notes { get; set; }

        // Navigation
        public Tenant? Tenant { get; set; } = null!;
        public Store? Store { get; set; } = null!;
        public Customer? Customer { get; set; } = null!;
        [JsonIgnore]
        public virtual ICollection<SaleItem> SaleItems { get; set; } = new List<SaleItem>();
        [JsonIgnore]

        public virtual ICollection<Payment> Payments { get; set; } = new List<Payment>();
    }
}
