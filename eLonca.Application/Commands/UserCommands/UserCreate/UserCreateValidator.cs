using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace eLonca.Application.Commands.UserCommands.UserCreate
{
    public class UserCreateValidator:AbstractValidator<UserCreateCommand>
    {
        public UserCreateValidator()
        {
            RuleFor(x => x.Name).NotEmpty().WithMessage("Kullanıcı adı boş olamas");
            RuleFor(x => x.LastName).NotEmpty().WithMessage("Kullanıcı soyadı boş olamas");
            RuleFor(x => x.Email).EmailAddress().WithMessage("email adresi doğru formatta değil");
            RuleFor(x => x.PhoneNumber).NotEmpty().WithMessage("kullanıcı telefonu boş olamaz");
            RuleFor(x => x.UserName).NotEmpty().WithMessage("kullanıcı adı boş olamaz").MinimumLength(5).WithMessage("en az 5 karakter olmalı");
        }
    }
}
