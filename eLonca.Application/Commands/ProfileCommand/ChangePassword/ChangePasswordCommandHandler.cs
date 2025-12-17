using eLonca.Common.Models;
using eLonca.Domain.Entities;
using eLonca.Domain.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace eLonca.Application.Commands.ProfileCommand.ChangePassword
{
    public class ChangePasswordCommandHandler : IRequestHandler<ChangePasswordCommand, Result<User>>
    {
        private readonly IUserRepository _userRepository;

        public ChangePasswordCommandHandler(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<Result<User>> Handle(ChangePasswordCommand request, CancellationToken cancellationToken)
        {
            var user = await _userRepository.GetByIdAsync(request.UserId);
            if (!user.IsSuccess)
            {
                return Result<User>.Failure(user.Errors, user.Message, user.StatusCode);
            }
            if (!request.NewPassword.Equals(request.NewPasswordConfirm, StringComparison.OrdinalIgnoreCase))
            {
                return Result<User>.Failure(null, "Şifreler Uyuşmuyor", 400);

            }

            var updatedUser = user.Data;
            updatedUser.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
            updatedUser.RefreshTokenExpiry = DateTime.Now.AddDays(7);

            var response = await _userRepository.Update(updatedUser, cancellationToken);
            return response;
        }
    }
}
