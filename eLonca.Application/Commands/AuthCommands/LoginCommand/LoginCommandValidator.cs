using FluentValidation;

namespace eLonca.Application.Commands.AuthCommands.LoginCommand
{
    public class LoginCommandValidator : AbstractValidator<LoginCommand>
    {
        public LoginCommandValidator()
        {
            RuleFor(x => x.Email).NotEmpty().WithMessage("Email boş olamaz")
                .EmailAddress().WithMessage("Geçerli bir email adresi giriniz");
            RuleFor(x => x.Password).NotEmpty().WithMessage("Şifre boş olamaz")
                .MinimumLength(6).WithMessage("En az 6 karakter girilmelidir");
            RuleFor(x => x.TenantId)
                .NotEmpty().WithMessage("Firma bilgisi boş olamaz");
        }
    }
}
