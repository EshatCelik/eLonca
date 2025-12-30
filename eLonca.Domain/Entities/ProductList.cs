using eLonca.Domain.Entities.BaseEntities;
using System.Text.Json.Serialization;


namespace eLonca.Domain.Entities
{
    public class ProductList : TenantBaseEntity
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public bool IsPublish { get; set; }
        public DateTime LastPublishDate { get; set; }
        public Guid StoreId { get; set; }
        public Store Store { get; set; }
        [JsonIgnore]
        public virtual ICollection<ProductListItem> ListItems { get; set; }
    }
}
