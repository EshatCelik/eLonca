using eLonca.Domain.Entities.BaseEntities;

namespace eLonca.Domain.Entities
{
    public class ProductCompany : TenantBaseEntity
    {
        public string Phone { get; set; }
        public string Address { get; set; }
        public string CompanyCode { get; set; }
        public string Name { get; set; }
        public Guid StoreId { get; set; }
        public Store Store { get; set; }
    }
}