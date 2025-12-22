using eLonca.Common;
using eLonca.Domain.Entities.BaseEntities;
using System.Text.Json.Serialization;

namespace eLonca.Domain.Entities
{
    public class StoreCustomer : TenantBaseEntity
    {
        public string CustomerCode { get; set; } = string.Empty; 
        public CustomerType CustomerType { get; set; }  
        public double DiscountRate { get; set; }       
        public Guid StoreId { get; set; }  // Navigation: Ana mağaza       
        public Guid CustomerStoreId { get; set; }   // Navigation: Müşteri olan mağaza

        [JsonIgnore]
        public virtual ICollection<CustomerAccount> CustomerAccounts { get; set; } = new List<CustomerAccount>();
        [JsonIgnore]
        public virtual ICollection<Sale> Sales { get; set; } = new List<Sale>();
        [JsonIgnore]
        public virtual ICollection<Payment> Payments { get; set; } = new List<Payment>();
    }

}
