using eLonca.Common.Models;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace eLonca.Application.Commands.AuthCommands.RefreshTokenCommand
{
    public class RefreshTokenCommand:IRequest<Result<LoginResponse>>
    {
        public string AccessToken { get; set; }
        public string RefreshToken { get; set; }
    }
}
