using eLonca.Domain.Entities.BaseEntities;

namespace eLonca.Domain.Entities
{
    public class Role :TenantBaseEntity
    {
        public string RoleName { get; set; }
        public string RoleCode { get; set; }
        public string Description { get; set; }
        public Guid StoreId { get; set; }
        public Store Store { get; set; }
        
    }
}
