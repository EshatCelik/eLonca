using eLonca.Domain.Entities.BaseEntities;

namespace eLonca.Domain.Entities
{
    public class Permission :TenantBaseEntity
    {
        public string Name { get; set; }
        public string Code { get; set; }
        public Guid RoleId { get; set; }
        public Role Role { get; set; }
    }
}
