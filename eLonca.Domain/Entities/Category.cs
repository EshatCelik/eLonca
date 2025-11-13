using eLonca.Domain.Entities.BaseEntities;
using System.Text.Json.Serialization;

namespace eLonca.Domain.Entities
{
    public class Category : TenantBaseEntity
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string ColorCode { get; set; } = string.Empty;


       [JsonIgnore]
        public Tenant Tenant { get; set; } = null!;

        public Guid StoreId { get; set; }

        [JsonIgnore]
        public Store Store { get; set; } = null!;

        [JsonIgnore]
        public virtual ICollection<Product> Products { get; set; } = new List<Product>();
    }
}
