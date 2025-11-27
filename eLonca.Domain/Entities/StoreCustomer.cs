using eLonca.Common;
using eLonca.Domain.Entities.BaseEntities;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace eLonca.Domain.Entities
{
    public class StoreCustomer : TenantBaseEntity
    {
        public string CustomerCode { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string? PhoneNumber { get; set; }
        public string? Email { get; set; }
        public string? Address { get; set; }
        public CustomerType CustomerType { get; set; }
        public string? TaxNumber { get; set; }
        public string? Notes { get; set; }
        public int DiscountRate { get; set; }

        // Navigation: Ana mağaza
        public Guid StoreId { get; set; }
        public Store Store { get; set; }

        // Navigation: Müşteri olan mağaza
        public Guid CustomerStoreId { get; set; } 

        public Tenant Tenant { get; set; }

        [JsonIgnore]
        public virtual ICollection<CustomerAccount> CustomerAccounts { get; set; } = new List<CustomerAccount>();

        [JsonIgnore]
        public virtual ICollection<Sale> Sales { get; set; } = new List<Sale>();

        [JsonIgnore]
        public virtual ICollection<Payment> Payments { get; set; } = new List<Payment>();
    }

}
