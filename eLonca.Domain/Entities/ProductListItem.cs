using eLonca.Domain.Entities.BaseEntities; 

namespace eLonca.Domain.Entities
{
    public class ProductListItem :TenantBaseEntity
    {
        public string ProductName { get; set; }
        public decimal Price { get; set; }
        public decimal Discount { get; set; }
        public Guid ProductListId { get; set; }
        public virtual ProductList ProductList { get; set; }
    }
}
