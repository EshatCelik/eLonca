using eLonca.Domain.Entities.BaseEntities; 

namespace eLonca.Domain.Entities
{
    public class User :TenantBaseEntity
    {
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public string FullName { get; set; }
        public string PhoneNumber { get; set; }
        public string? RefreshToken { get; set; }
        public DateTime? RefreshTokenExpiry { get; set; }
        public UserRole UserRole { get; set; }
        public bool IsActive { get; set; }

        public Tenant Tenant { get; set; }
        public virtual ICollection<Store> Stores { get; set; }

    }

    public enum UserRole
    {
        SuperAdmin,
        TenantAdmin,
        Manager,
        User
    }
}
