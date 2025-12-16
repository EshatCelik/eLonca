using eLonca.Application.Models;

namespace eLonca.Common.Models
{
    public class LoginResponse
    {
        public string Token { get; set; }
        public string RefreshToken { get; set; }
        public string TenantId { get; set; }
        public Guid UserId { get; set; }
        public Guid StoreId { get; set; }
        public string Email { get; set; }
        public string FullName { get; set; }
        public string Role { get; set; }
        public DateTime ExpiresAt { get; set; }
        public TenantInfo Tenant { get; set; }

    }
}
