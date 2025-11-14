using eLonca.Application.Services.AuthService;
using eLonca.Common.Models;
using eLonca.Domain.Entities;
using eLonca.Domain.Interfaces;
using MediatR;

namespace eLonca.Application.Commands.AuthCommands.RegisterCommand
{
    public class RegisterCommandHandler : IRequestHandler<RegisterCommand, Result<LoginResponse>>
    {
        private readonly IAuthService _authService;
        private readonly IUserRepository _userRepository;
        private readonly IUnitOfWork _unitOfWork; 

        public RegisterCommandHandler(IAuthService authService, IUserRepository userRepository,IUnitOfWork unitOfWork)
        {
            _authService = authService;
            _userRepository = userRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Result<LoginResponse>> Handle(RegisterCommand request, CancellationToken cancellationToken)
        {
            var response = await _authService.Register(request.TenantId, request.Email, request.Password, request.IpAddress, request.FirstName, request.LastName);
            if (!response.IsSuccess)
            {
                return Result<LoginResponse>.Failure(null, "Kullanıcı kaydı başarısız", 400);
            }

            var user = new User()
             {
                 TenantId =Guid.Parse( request.TenantId),
                 Email = request.Email,
                 PasswordHash = request.Password,
                 Name = request.FirstName,
                 LastName = request.LastName,
                 UserRole = UserRole.User,
                 PhoneNumber=request.Phone,
                 UserName=request.UserName,
                 
             };
            
            var addResult= await _userRepository.CreateAsync(user, cancellationToken);
            if (!addResult.IsSuccess)
            {
                return Result<LoginResponse>.Failure(null,"Kullanıcı kaydı başarısız",400);
            }
            await _unitOfWork.SaveChangeAsync(cancellationToken);




            return response;

        }
    }
}
