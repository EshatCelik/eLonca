
using eLonca.Application.Services.AuthService;
using eLonca.Common.Models;
using MediatR;

namespace eLonca.Application.Commands.AuthCommands.LoginCommand
{
    public class LoginCommandHandler : IRequestHandler<LoginCommand, Result<LoginResponse>>
    { 
        private readonly IAuthService _authService;

        public LoginCommandHandler(IAuthService authService)
        {
            _authService = authService;
        }

        public Task<Result<LoginResponse>> Handle(LoginCommand request, CancellationToken cancellationToken)
        {
           var result= _authService.Login(request.UserName, request.Password, request.TenantId, request.IpAddress, cancellationToken);


          return result;
        }
    }
}
