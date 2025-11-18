using eLonca.Application.Commands.AuthCommands.LoginCommand;
using eLonca.Application.Models;
using eLonca.Common.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace eLonca.Application.Services.AuthService
{
    public interface IAuthService
    {
        Task<Result<LoginResponse>> Login(string username, string password, string tenantId, string ipAddress, CancellationToken cancellationToken);
        Task<Result<LoginResponse>> Register(string tenant, string email, string password, string ipAddress, string firstName, string lastName);
        Task<Result<LoginResponse>> RefreshToken(string token, string refreshToken, string ipAddress, CancellationToken cancellationToken);
        Task<Result> ChangePassword(string username, string newPassword, string oldPassword);
        Task<Result> ForgotPassword(string email, string tenantId);
        Task<Result> ResetPassword(string email, string tenantId, string resetToken, string newPassword);
        Task<Result> Logout(string email, string tenantId);
    }
}
