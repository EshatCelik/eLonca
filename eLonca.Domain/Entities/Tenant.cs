using eLonca.Domain.Entities.BaseEntities;
using System.Text.Json.Serialization;

namespace eLonca.Domain.Entities
{
    public class Tenant : BaseEntity
    {
        public string Name { get; set; }
        public string Subdomain { get; set; }
        public string ConnectionString { get; set; }
        public TenantStatus Status { get; set; }
        public TenantPlan TenantPlan { get; set; }
        public DateTime? SubscriptionEndDate { get; set; }
        public int MaxUser { get; set; }
        public int MaxStores { get; set; }
        public string LogoUrl { get; set; }
        public string? ContractEmail { get; set; }
        public string? ContractPhone { get; set; } 

        [JsonIgnore]
        public virtual ICollection<User> Users { get; set; } = new List<User>();

        [JsonIgnore]
        public virtual ICollection<Store> Stores { get; set; } = new List<Store>();

        [JsonIgnore]
        public virtual ICollection<Category> Categories { get; set; } = new List<Category>();

        [JsonIgnore]
        public virtual ICollection<StoreCustomer> Customers { get; set; } = new List<StoreCustomer>();

        [JsonIgnore]
        public virtual ICollection<CustomerAccount> CustomerAccounts { get; set; } = new List<CustomerAccount>();

        [JsonIgnore]
        public virtual ICollection<Sale> Sales { get; set; } = new List<Sale>();

        [JsonIgnore]
        public virtual ICollection<StockMovement> StockMovements { get; set; } = new List<StockMovement>();

        [JsonIgnore]
        public virtual ICollection<Product> Products { get; set; } = new List<Product>();

        [JsonIgnore]
        public virtual ICollection<Payment> Payments { get; set; } = new List<Payment>();

        [JsonIgnore]
        public virtual ICollection<SaleItem> SaleItems { get; set; } = new List<SaleItem>();


    }

    public enum TenantStatus
    {
        Active,
        Suspended,
        Canceled,
        Trial
    }
    public enum TenantPlan
    {
        Trial = 0,
        Basic = 1,
        Professional = 2,
        Enterprice = 3
    }
}
