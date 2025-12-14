using FluentValidation;

namespace eLonca.Application.Commands.UserCommands.UserUpdate
{
    public class UserUpdateCommandValidator:AbstractValidator<UserUpdateCommand>
    {
        public UserUpdateCommandValidator()
        {
            RuleFor(x => x.Name).NotEmpty().WithMessage("Kullanıcı adı boş olamas");
            RuleFor(x => x.LastName).NotEmpty().WithMessage("Kullanıcı soyadı boş olamas");
            RuleFor(x => x.Email).EmailAddress().WithMessage("email adresi doğru formatta değil");
            RuleFor(x => x.PhoneNumber).NotEmpty().WithMessage("kullanıcı telefonu boş olamaz"); 
            RuleFor(x => x.UserName).NotEmpty().WithMessage("kullanıcı adı boş olamaz").MinimumLength(5).WithMessage("en az 5 karakter olmalı");
        }
    }
}
