using eLonca.Common.Models;
using eLonca.Domain.Entities;
using eLonca.Domain.Interfaces;
using eLonca.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace eLonca.Infrastructure.Repositories
{
    public class AuthRepository : IAuthRepository
    {
        private readonly LoncaDbContext _loncaDbContext;

        public AuthRepository(LoncaDbContext loncaDbContext)
        {
            _loncaDbContext = loncaDbContext;
        }

        public Task<Result> ChangePassword(string username, string newPassword, string oldPassword)
        {
            throw new NotImplementedException();
        }

        public Task<Result> ForgotPassword(string email, string tenantId)
        {
            throw new NotImplementedException();
        }

        public async Task<Result<LoginResponse>> Login(string email, string password, string tenantId, string ipAddress)
        {
            var tenant = await _loncaDbContext.Tenants.FirstOrDefaultAsync(x => x.Id == Guid.Parse(tenantId));
            if (tenant == null)
            {
                return Result<LoginResponse>.Failure(null, "Tenant bulunamadı", 400);
            }
            if (!tenant.IsActive)
            {
                return Result<LoginResponse>.Failure(null, "Tenant active değil", 400);
            }
            var userResult = await _loncaDbContext.Users.FirstOrDefaultAsync(x => x.Email == email );
            if (userResult == null)
            {
                return Result<LoginResponse>.Failure(null, "user bulunamadı", 400);
            }

            var loginResponse = new LoginResponse()
            {
                Email = userResult.Email,
                TenantId = tenantId,
                FullName = userResult.Name + " " + userResult.LastName,
                Role = userResult.UserRole.ToString(),
                UserId = userResult.Id,

            };

            return Result<LoginResponse>.Success(loginResponse, "Login Başarılı", 200);


        }

        public Task<Result> Logout(string email, string tenantId)
        {
            throw new NotImplementedException();
        }

        public Task<Result> RefreshToken(string token, string refreshToken, string ipAddress)
        {
            throw new NotImplementedException();
        }

        public async Task<Result<LoginResponse>> Register(string tenant, string email, string password, string ipAddress, string firstName, string lastName)
        {
            var checkTenant = await _loncaDbContext.Tenants.FirstOrDefaultAsync(x => x.Id == Guid.Parse(tenant));
            if (checkTenant == null)
            {
                return Result<LoginResponse>.Failure(null, "Firma bilgisi bulunamadı", 400);
            }
            var emailExist = await _loncaDbContext.Users.Where(x => x.Email == email && x.TenantId == Guid.Parse(tenant)).FirstOrDefaultAsync();
            if (emailExist!=null)
            {
                return Result<LoginResponse>.Failure(null, "kullanıcı email daha önce kaydedilmiş", 400);
            }
            return Result<LoginResponse>.Success(null, "Register Başarılı", 200);
        }

        public Task<Result> ResetPassword(string email, string tenantId, string resetToken, string newPassword)
        {
            throw new NotImplementedException();
        }
    }
}
