using eLonca.Application.Services.AuthService;
using eLonca.Application.Services.JwtTokenService;
using eLonca.Common.Models;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace eLonca.Application.Commands.AuthCommands.RefreshTokenCommand
{
    public class RefreshTokenHandler : IRequestHandler<RefreshTokenCommand, Result<LoginResponse>>
    {
        private readonly IAuthService _authService;

        public RefreshTokenHandler(IAuthService authService)
        {
            _authService = authService;
        }

        public async Task<Result<LoginResponse>> Handle(RefreshTokenCommand request, CancellationToken cancellationToken)
        {
            var response = await _authService.RefreshToken(request.AccessToken, request.RefreshToken,"", cancellationToken);

            return response;
        }
    }
}
