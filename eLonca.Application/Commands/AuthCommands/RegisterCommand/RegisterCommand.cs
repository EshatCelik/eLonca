using eLonca.Common.Models;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace eLonca.Application.Commands.AuthCommands.RegisterCommand
{
    public class RegisterCommand:IRequest<Result<LoginResponse>>
    {
        public string TenantId { get; set; }
        public string StoreId { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string ConfirmPassword { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Phone { get; set; }
        public string IpAddress { get; set; }
        public string UserName { get; set; }
    }
}
