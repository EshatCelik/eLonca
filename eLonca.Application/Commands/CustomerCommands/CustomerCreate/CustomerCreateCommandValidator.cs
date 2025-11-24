using eLonca.Domain.Entities;
using FluentValidation;

namespace eLonca.Application.Commands.CustomerCommands.CustomerCreate
{
    public class CustomerCreateCommandValidator:AbstractValidator<Customer>
    {
        public CustomerCreateCommandValidator()
        { 
            RuleFor(x => x.FirstName).NotEmpty().WithMessage("Müşteri adı boş olamaz").MinimumLength(3).WithMessage("en az 3 karakter olmalı");
            RuleFor(x => x.LastName).NotEmpty().WithMessage("Müşteri soyadı boş olamaz").MinimumLength(3).WithMessage("en az 3 karakter olmalı");
            RuleFor(x => x.PhoneNumber).NotEmpty().NotNull().WithMessage("telefon boş olamaz");
            RuleFor(x => x.TenantId).NotEmpty().NotNull().WithMessage("Tenant null olmaz");
        }
    }
}
