using FluentValidation;

namespace eLonca.Application.Commands.ProfileCommand.ChangePassword
{
    public class ChangePasswordCommandValidator:AbstractValidator<ChangePasswordCommand>
    {
        public ChangePasswordCommandValidator()
        {
            RuleFor(x => x.CurrentPassword).Empty().NotNull().WithMessage("Şifre boş olamaz").MinimumLength(5).WithMessage("en az 5 karakterli olmalı");
            RuleFor(x => x.NewPassword).Empty().NotNull().WithMessage("Şifre boş olamaz").MinimumLength(5).WithMessage("en az 5 karakterli olmalı");
            RuleFor(x => x.NewPasswordConfirm).Empty().NotNull().WithMessage("Şifre boş olamaz").Equal(x=>x.NewPassword).WithMessage("şifreler uyuşmuyor").MinimumLength(5).WithMessage("en az 5 karakterli olmalı");
        }
    }
}
