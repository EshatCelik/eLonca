using FluentValidation;

namespace eLonca.Application.Commands.AuthCommands.RegisterCommand
{
    public class RegisterCommandValidator:AbstractValidator<RegisterCommand>
    {
        public RegisterCommandValidator()
        {
            RuleFor(x => x.UserEmail).NotEmpty().WithMessage("Email boş olamaz").EmailAddress().WithMessage("uygun formatta email giriniz");
            RuleFor(x => x.UserPhone).NotEmpty().WithMessage("Telefon boş olamaz").MinimumLength(11).WithMessage("Telefon karakter sayısı min 11 olmalı");
            RuleFor(x => x.PasswordConfirm).NotEmpty().WithMessage("Şifre boş olamaz").Equal(x => x.Password).WithMessage("şifreler uyuşmuyor");
            RuleFor(x => x.UserFirsName).NotEmpty().WithMessage("kişi adı boş olamaz").MinimumLength(3).WithMessage("en az 3 karakter olmalı"); ;
            RuleFor(x => x.UserLastName).NotEmpty().WithMessage("kişi soyadı boş olamaz").MinimumLength(3).WithMessage("en az 3 karakter olmalı"); ;
            RuleFor(x => x.UserName).NotEmpty().WithMessage("kullanıcı adı boş olamaz");
            RuleFor(x => x.UserRole).NotEmpty().WithMessage("kullanıcı rolü boş olamaz");

            RuleFor(x => x.TenantPlan).NotEmpty().WithMessage("Firma paln bilgisi boş olamas");
            RuleFor(x => x.TenantName).NotEmpty().WithMessage(" firma adı boş olamaz");

            //TODO: Tenant bilgileri ve store bilgileri daha sonra eklenecek
        }
    }
}
