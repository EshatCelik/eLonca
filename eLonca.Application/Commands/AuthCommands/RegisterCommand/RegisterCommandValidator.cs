using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace eLonca.Application.Commands.AuthCommands.RegisterCommand
{
    public class RegisterCommandValidator:AbstractValidator<RegisterCommand>
    {
        public RegisterCommandValidator()
        {
            RuleFor(x => x.Email).NotEmpty().WithMessage("Email boş olamaz").EmailAddress().WithMessage("uygun formatta email giriniz");
            RuleFor(x => x.Phone).NotEmpty().WithMessage("Telefon boş olamaz").MinimumLength(11).WithMessage("Telefon karakter sayısı min 11 olmalı");
            RuleFor(x => x.TenantId).NotEmpty().WithMessage("Firma bilgisi boş olamas");
            RuleFor(x => x.Password).NotEmpty().WithMessage("Şifre boş olamaz").NotEqual(x => x.ConfirmPassword).WithMessage("şifreler uyuşmuyor");
            RuleFor(x => x.IpAddress).NotEmpty().WithMessage("ip adresi bulunamadı");
            RuleFor(x => x.FirstName).NotEmpty().WithMessage("Kullanıcı adı boş olamaz").MinimumLength(3).WithMessage("en az 3 karakter olmalı");
            RuleFor(x => x.LastName).NotEmpty().WithMessage("Kullanıcı soyadı boş olamaz").MinimumLength(3).WithMessage("en az 3 karakter olmalı");
        }
    }
}
