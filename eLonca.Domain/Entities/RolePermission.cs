using eLonca.Domain.Entities.BaseEntities;

namespace eLonca.Domain.Entities
{
    public class RolePermission :TenantBaseEntity
    {
        public Guid RoleId { get; set; }
        public Role Role { get; set; }
        public Guid PermissionId { get; set; }
        public Permission Permission { get; set; }

        public DateTime StartPermissionDate { get; set; }
        public DateTime LastPermissionDate { get; set; }



    }
}
