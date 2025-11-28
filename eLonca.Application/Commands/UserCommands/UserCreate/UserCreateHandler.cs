using eLonca.Application.Services.JwtTokenService;
using eLonca.Common.Models;
using eLonca.Domain.Entities;
using eLonca.Domain.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace eLonca.Application.Commands.UserCommands.UserCreate
{
    public class UserCreateHandler : IRequestHandler<UserCreateCommand, Result<User>>
    {
        private readonly IUserRepository _userRepository;
        private readonly IStoreRepository _storeRepository;
        private readonly IUnitOfWork unitOfWork;
        private readonly IJwtTokenService _jwtTokenService;
        public UserCreateHandler(IUserRepository userRepository, IUnitOfWork unitOfWork = null, IStoreRepository storeRepository = null, IJwtTokenService jwtTokenService = null)
        {
            _userRepository = userRepository;
            this.unitOfWork = unitOfWork;
            _storeRepository = storeRepository;
            _jwtTokenService = jwtTokenService;
        }

        public async Task<Result<User>> Handle(UserCreateCommand request, CancellationToken cancellationToken)
        {
            var user = new User()
            {
                UserName = request.UserName,
                Email = request.Email,
                Name = request.Name,
                LastName = request.LastName,
                UserRole = request.UserRole ?? UserRole.User,
                PhoneNumber = request.PhoneNumber,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                RefreshTokenExpiry = DateTime.Now.AddDays(7),
                IsActive = true,
                StoreId = request.StoreId,
            };
            var isUserExist = _userRepository.IsEmailExistInTenantAsync(request.Email, request.StoreId, request.UserName, cancellationToken);
            if (isUserExist.Result.IsSuccess)
            {
                return Result<User>.Failure(null, "Kullanıcı daha önce eklenmiş", 400);
            }
            if (request.StoreId != null)
            {
                var store = await _storeRepository.GetByIdAsync(request.StoreId);
                if (store == null)
                {
                    return Result<User>.Failure(null, "Kullanıcı mağazası bulunamadı", 400);
                }

            }

            var response = await _userRepository.CreateAsync(user, cancellationToken);
            return response;
        }
    }
}
