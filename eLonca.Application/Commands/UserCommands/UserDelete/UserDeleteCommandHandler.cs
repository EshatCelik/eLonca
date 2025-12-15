using eLonca.Common.Models;
using eLonca.Domain.Entities;
using eLonca.Domain.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace eLonca.Application.Commands.UserCommands.UserDelete
{
    public class UserDeleteCommandHandler : IRequestHandler<UserDeleteCommand, Result<User>>
    {
        public readonly IUserRepository _userRepository;
        private readonly IUnitOfWork _unitOfWork;
        public UserDeleteCommandHandler(IUserRepository userRepository, IUnitOfWork unitOfWork)
        {
            _userRepository = userRepository;
            _unitOfWork = unitOfWork;
        }
        public async Task<Result<User>> Handle(UserDeleteCommand request, CancellationToken cancellationToken)
        {
            var user = await _userRepository.GetByIdAsync(request.Id);
            if (!user.IsSuccess)
            {
                return user;
            }
            var result = await _userRepository.DeleteAsync(user.Data, cancellationToken);
            if (!result.IsSuccess)
            {
                return Result<User>.Failure(result.Errors, result.Message, 400);
            }
            _unitOfWork.SaveChangeAsync(cancellationToken);
            return Result<User>.Success(user.Data, "Kullanıcı silindi", 200);
        }
    }
}
