using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace eLonca.Application.Commands.SaleCommand.SaleCreate
{
    public class SaleCreateCommandValidator : AbstractValidator<SaleCreateCommand>
    {
        public SaleCreateCommandValidator()
        {
            RuleFor(x => x.Notes).NotEmpty().WithMessage("not null olamaz");
            RuleFor(x => x.PaymentType).NotEmpty().NotNull().WithMessage("Ödeme tipi giriniz");
            RuleFor(x => x.PaymentStatus).NotNull().NotEmpty().WithMessage("Ödeme durumu giriniz ");
        }
    }
}
