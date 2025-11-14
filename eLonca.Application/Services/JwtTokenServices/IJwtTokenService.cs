using eLonca.Application.Models;
using eLonca.Common.Models;
using eLonca.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace eLonca.Application.Services.JwtTokenService
{
    public interface IJwtTokenService
    {
        Result<int> ValidateToken(string token);
        Result<string> GetUserIdFromToken(string token);
        Result<string> GetTenantIdFromToken(string token);
        Result<RefreshToken> GenerateRefreshToken(User user);
        Result<string> GenerateAccessToken(User user);
        Result<LoginResponse> CreateLoginResponse(User user, string accessToken, RefreshToken refreshToken);
    }
}
