using eLonca.Common.Models;
using eLonca.Domain.Entities;
using eLonca.Domain.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace eLonca.Application.Commands.UserCommands.UserUpdate
{
    public class UserUpdateCommandHandler : IRequestHandler<UserUpdateCommand, Result<User>>
    {
        private readonly IUserRepository _userRepository;

        public UserUpdateCommandHandler(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<Result<User>> Handle(UserUpdateCommand request, CancellationToken cancellationToken)
        {
            var user = await _userRepository.GetByIdAsync(request.Id);
            if (!user.IsSuccess)
            {
                return user;
            }
            var updateUser = user.Data;
            updateUser.StoreId = request.StoreId;
            updateUser.Name = request.Name;
            updateUser.Email = request.Email;
            updateUser.UserName = request.UserName;
            updateUser.LastName = request.LastName;
            updateUser.PhoneNumber = request.PhoneNumber;
            updateUser.IsActive = request.IsActive;
            updateUser.UserRole = (UserRole)request.UserRole;

            var result = await _userRepository.Update(updateUser, cancellationToken);
            return result;
        }
    }
}
