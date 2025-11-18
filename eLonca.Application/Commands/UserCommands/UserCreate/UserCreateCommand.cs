using eLonca.Common.Models;
using eLonca.Domain.Entities;
using MediatR;

namespace eLonca.Application.Commands.UserCommands.UserCreate
{
    public class UserCreateCommand:IRequest<Result<User>>
    {
        public string Name { get; set; }
        public string UserName { get; set; }
        public string LastName { get; set; } 
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string Password { get; set; }
        public string? RefreshToken { get; set; }
        public DateTime? RefreshTokenExpiry { get; set; }
        public UserRole? UserRole { get; set; }
        public bool IsActive { get; set; }
        public Guid StoreId { get; set; }
    }
}
