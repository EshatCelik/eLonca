using eLonca.Common.Models;
using MediatR; 

namespace eLonca.Application.Commands.AuthCommands.LogOutCommand
{
    public class LogOutCommandResponse :IRequest<Result>
    {
        public string Email { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public string TenantId { get; set; }
        public string IpAddress { get; set; }
    }
}
