using eLonca.Application.Models;
using eLonca.Application.Services.JwtTokenService;
using eLonca.Common.Models;
using eLonca.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace eLonca.Application.Services.AuthService
{
    public class AuthService : IAuthService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IAuthRepository _authRepository;
        private readonly IJwtTokenService _jwtTokenService;
        private readonly IUserRepository _userRepository;
        //private readonly IEmailService _emailService;  // ileride eklenecek

        public AuthService(IUnitOfWork unitOfWork, IJwtTokenService jwtTokenService, IAuthRepository authRepository, IUserRepository userRepository = null)
        {
            _unitOfWork = unitOfWork;
            _jwtTokenService = jwtTokenService;
            _authRepository = authRepository;
            _userRepository = userRepository;
        }

        public Task<Result> ChangePassword(string username, string newPassword, string oldPassword)
        {
            throw new NotImplementedException();
        }

        public Task<Result> ForgotPassword(string email, string tenantId)
        {
            throw new NotImplementedException();
        }

        public async Task<Result<LoginResponse>> Login(string username, string password, string tenantId, string ipAddress, CancellationToken cancellationToken)
        {
            var loginResponse = await _authRepository.Login(username, password, tenantId, ipAddress);
            var user = await _userRepository.GetByEmailAndTenantAsync(loginResponse.Data.Email , cancellationToken);
            if (user == null)
                return Result<LoginResponse>.Failure(null, "Kullanıcı bulunamadı", 400);

            var accessToken = _jwtTokenService.GenerateAccessToken(user.Data);
            var refreshToken = _jwtTokenService.GenerateRefreshToken(user.Data);

            var responseResult = _jwtTokenService.CreateLoginResponse(user.Data, accessToken.Data, refreshToken.Data);

            if (!responseResult.IsSuccess)
            {
                return Result<LoginResponse>.Failure(null, "Giriş başarısız", 400);

            }
            return Result<LoginResponse>.Success(responseResult.Data, "Giriş Başarılı", 200);

        }

        public Task<Result> Logout(string email, string tenantId)
        {
            throw new NotImplementedException();
        }

        public Task<Result> RefreshToken(string token, string refreshToken, string ipAddress)
        {
            throw new NotImplementedException();
        }

        public Task<Result<LoginResponse>> Register(string tenant, string email, string password, string ipAddress, string firstName, string lastName)
        {
            var tenantResponse = _authRepository.Register(tenant, email, password, ipAddress, firstName, ipAddress);

            return tenantResponse;
            

        }

        public Task<Result> ResetPassword(string email, string tenantId, string resetToken, string newPassword)
        {
            throw new NotImplementedException();
        }
    }
}
