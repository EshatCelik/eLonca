using eLonca.Domain.Entities.BaseEntities;

namespace eLonca.Domain.Entities
{
    public class User : TenantBaseEntity
    {
        public string Name { get; set; }
        public string UserName { get; set; }
        public string LastName { get; set; }
        public virtual string FullName => $"{Name} {LastName}";
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public string PhoneNumber { get; set; }
        public string? RefreshToken { get; set; }
        public DateTime? RefreshTokenExpiry { get; set; }
        public UserRole UserRole { get; set; }

        public Guid? StoreId { get; set; }
        public Store? Store { get; set; }
        public Tenant Tenant { get; set; } 

    }

    public enum UserRole
    {
        SuperAdmin,
        TenantAdmin,
        Manager,
        User
    }
}
