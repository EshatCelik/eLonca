using eLonca.Domain.Entities.BaseEntities;
using System.Text.Json.Serialization;

namespace eLonca.Domain.Entities
{
    public class Store : TenantBaseEntity
    {
        public string StoreName { get; set; }
        public string Address { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        public string TaxNumber { get; set; }
        public string LogoUrl { get; set; }       
        public Tenant Tenant { get; set; }

        [JsonIgnore]
        public virtual ICollection<Product> Products { get; set; }
        [JsonIgnore]

        public virtual ICollection<Customer> Customers { get; set; }
        [JsonIgnore]

        public virtual ICollection<Sale> Sales { get; set; }
        [JsonIgnore]

        public virtual ICollection<Category> Categories { get; set; }
        [JsonIgnore]
        public virtual ICollection<User> Users { get; set; } = new List<User>();

    }
}
