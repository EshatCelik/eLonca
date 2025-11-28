using eLonca.Application.Models;
using eLonca.Common.Models;
using eLonca.Domain.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace eLonca.Application.Services.JwtTokenService
{
    public class JwtTokenService : IJwtTokenService
    {
        private readonly IConfiguration _configuration;

        public JwtTokenService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public Result<LoginResponse> CreateLoginResponse(User user, string accessToken, RefreshToken refreshToken)
        {
            //HttpContext.Connection.RemoteIpAddress?.ToString()
            try
            {
                var response = new LoginResponse
                {
                    Token = accessToken,
                    RefreshToken = refreshToken.Token,
                    TenantId = user.Tenant.Id.ToString(),
                    UserId = user.Id,
                    Email = user.Email,
                    FullName = $"{user.Name} {user.LastName}",
                    Role = user.UserRole.ToString(),
                    ExpiresAt = DateTime.UtcNow.AddHours(Convert.ToDouble(_configuration["Jwt:ExpirationHours"] ?? "8")),
                    Tenant = new TenantInfo
                    {
                        Id = user.Tenant.Id,
                        CompanyName = user.Tenant.Name
                    }
                };

                return Result<LoginResponse>.Success(response, "Login response oluşturuldu", 200);
            }
            catch (Exception ex)
            {
                return Result<LoginResponse>.Failure(null, $"Response oluşturulurken hata: {ex.Message}", 400);
            }
        }

        public Result<string> GenerateAccessToken(User user)
        {
            try
            {
                var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
                var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha512);
                var tokenExpr = DateTime.Now;
                var claims = new[]
                {
                    new Claim(JwtRegisteredClaimNames.Sub,user.Id.ToString() ),
                    new Claim(JwtRegisteredClaimNames.Email,user.Email),
                    new Claim(JwtRegisteredClaimNames.Jti,Guid.NewGuid().ToString()),
                    new Claim(ClaimTypes.NameIdentifier,user.Email),
                    new Claim(ClaimTypes.Role,user.UserRole.ToString()),
                    new Claim("TenantId",user.TenantId.ToString()),
                    new Claim("FullName",user.FullName),
                    new Claim("UserId",user.Id.ToString()),
                    new Claim("TokenExpr",DateTime.Now.AddHours(Convert.ToDouble(_configuration["Jwt:ExpirationHours"] ?? "8")).ToString())
                };


                var token = new JwtSecurityToken(

                    issuer: _configuration["Jwt:issuer"],
                    audience: _configuration["Jwt:Audience"],
                    claims: claims,
                    expires: DateTime.Now.AddHours(Convert.ToDouble(_configuration["Jwt:ExpirationHours"] ?? "8")),
                    signingCredentials: credentials
                    );

                var tokenString = new JwtSecurityTokenHandler().WriteToken(token);
                return Result<string>.Success(tokenString, "AccessToken", 200);

            }
            catch (Exception ex)
            {

                return Result<string>.Failure(new List<string> { ex.Message }, "Acces Token Hatası", 400);
            }
        }

        public Result<RefreshToken> GenerateRefreshToken(User user)
        {
            try
            {
                var refreshToken = new RefreshToken
                {
                    Token = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64)),
                    ExpiresAt = DateTime.UtcNow.AddDays(7),
                    CreatedAt = DateTime.UtcNow,
                    CreatedByIp = user.Id.ToString(),

                };
                return Result<RefreshToken>.Success(refreshToken, "Access Token Oluşturuldu", 200);

            }
            catch (Exception ex)
            {
                return Result<RefreshToken>.Failure(new List<string> { ex.Message }, "Refresh Token oluştururken hata oluştur", 400);
            }
        }

        public Result<ClaimsPrincipal> GetPrincipleFromExpiredToken(string token ,CancellationToken cancellationToken)
        {
            var tokenParams = new TokenValidationParameters
            {
                ValidateAudience = false,
                ValidateIssuer = false,
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"])),
                ValidateLifetime = false

            };
            return Result<ClaimsPrincipal>.Success( new JwtSecurityTokenHandler().ValidateToken(token, tokenParams, out _),"Claim Listesi",200);
        } 
        public Result<string> GetTenantIdFromToken(string token)
        {
            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var jwtToken = tokenHandler.ReadJwtToken(token);
                var tenantId = jwtToken.Claims.First(x => x.Type == "TenantId").Value;
                return Result<string>.Success(tenantId, "TenantId", 200);
            }
            catch (Exception ex)
            {
                return Result<string>.Failure(new List<string> { ex.Message }, "TenantId bulunamadı", 400);
            }
        }

        public Result<string> GetUserIdFromToken(string token)
        {
            try
            {

                var tokenHandler = new JwtSecurityTokenHandler();
                var jwtToken = tokenHandler.ReadJwtToken(token);
                var userId = jwtToken.Claims.First(x => x.Type == "UserId").Value;

                return Result<string>.Success(userId, "userId ", 200);
            }
            catch (Exception ex)
            {
                return Result<string>.Failure(new List<string> { ex.Message }, "userId bulunamadı", 400);

            }
        }

        public Result<int> ValidateToken(string token)
        {
            try
            {
                if (string.IsNullOrEmpty(token))
                    return Result<int>.Failure(null, "Token boş olamaz", 400);

                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]);

                tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = true,
                    ValidIssuer = _configuration["Jwt:Issuer"],
                    ValidateAudience = true,
                    ValidAudience = _configuration["Jwt:Audience"],
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero
                }, out SecurityToken validatedToken);

                var jwtToken = (JwtSecurityToken)validatedToken;
                var userId = int.Parse(jwtToken.Claims.First(x => x.Type == "UserId").Value);

                return Result<int>.Success(userId, "Token geçerli", 200);
            }
            catch (SecurityTokenExpiredException)
            {
                return Result<int>.Failure(null, "Token süresi dolmuş", statusCode: 401);
            }
            catch (Exception ex)
            {
                return Result<int>.Failure(null, $"Token doğrulama hatası: {ex.Message}", statusCode: 401);
            }
        } 
    }
}
