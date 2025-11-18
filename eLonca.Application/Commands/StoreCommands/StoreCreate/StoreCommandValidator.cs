using eLonca.Domain.Entities;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace eLonca.Application.Commands.StoreCommands.StoreCreate
{
    public class StoreCommandValidator:AbstractValidator<Store>
    {
        public StoreCommandValidator()
        {
            RuleFor(x => x.StoreName).NotEmpty().WithMessage(" mağaza adı boş olamaz");
            RuleFor(x => x.Phone).NotEmpty().WithMessage("telefon boş olamaz");
        }
    }
}
