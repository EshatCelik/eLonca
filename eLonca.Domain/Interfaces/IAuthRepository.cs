using eLonca.Common.Models;

namespace eLonca.Domain.Interfaces
{
    public  interface IAuthRepository
    {
        Task<Result<LoginResponse>> Login(string username, string password, string tenantId, string ipAddress);
        Task<Result<LoginResponse>> Register(string tenant, string email, string password, string ipAddress, string firstName, string lastName);
        Task<Result> RefreshToken(string token, string refreshToken, string ipAddress);
        Task<Result> ChangePassword(string username, string newPassword, string oldPassword);
        Task<Result> ForgotPassword(string email, string tenantId);
        Task<Result> ResetPassword(string email, string tenantId, string resetToken, string newPassword);
        Task<Result> Logout(string email, string tenantId);
    }
}
