using eLonca.Domain.Entities.BaseEntities;

namespace eLonca.Domain.Entities
{
    public class Customer : TenantBaseEntity
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

        // Navigation 
        public Tenant Tenant { get; set; } = null!;
        public Guid StoreId { get; set; }
        public Store Store { get; set; } = null!;

        public virtual ICollection<CustomerAccount> CustomerAccounts { get; set; }
        public virtual ICollection<Sale> Sales { get; set; } = new List<Sale>();
        public virtual ICollection<Payment> Payments { get; set; } = new List<Payment>(); 
    }

    public enum CustomerType
    {
        Individual = 1,
        Corporate = 2
    }
}
