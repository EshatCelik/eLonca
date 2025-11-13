using eLonca.Common.Interfaces;
using eLonca.Common.Models;

namespace eLonca.Application.Commands.AuthCommands.LoginCommand
{
    public class LoginCommand:IQuery<Result<LoginResponse>>
    {
        public string Email { get; set; }
        public string Password { get; set; }
        public string TenantId { get; set; }
    }

    public class LoginResponse
    {
        public string Token { get; set; }
        public string TenantId { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string FullName { get; set; }
        public string Role { get; set; }
    }
}
