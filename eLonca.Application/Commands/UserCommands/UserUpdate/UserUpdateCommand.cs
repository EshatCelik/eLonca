using eLonca.Common.Models;
using eLonca.Domain.Entities;
using MediatR;

namespace eLonca.Application.Commands.UserCommands.UserUpdate
{
    public class UserUpdateCommand:IRequest<Result<User>>
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string UserName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; } 
        public UserRole? UserRole { get; set; }
        public bool IsActive { get; set; }
        public Guid StoreId { get; set; }
    }
}
