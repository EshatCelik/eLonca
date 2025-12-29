using eLonca.Domain.Entities.BaseEntities;
 

namespace eLonca.Domain.Entities
{
    public class ProductList : TenantBaseEntity
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime LastPublishDate { get; set; }
        public Guid StoreId { get; set; }
        public Store Store { get; set; }

        public virtual ICollection<ProductListItem> ListItems { get; set; }
    }
}
