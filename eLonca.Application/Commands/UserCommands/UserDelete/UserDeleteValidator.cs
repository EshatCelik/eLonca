using eLonca.Domain.Entities;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace eLonca.Application.Commands.UserCommands.UserDelete
{
    public class UserDeleteValidator:AbstractValidator<User>
    {
        public UserDeleteValidator()
        {
            RuleFor(x => x.Id).NotEmpty().WithMessage("Id boş olamaz");
        }
    }
}
