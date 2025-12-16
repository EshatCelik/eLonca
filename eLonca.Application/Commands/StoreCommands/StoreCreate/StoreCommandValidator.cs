using eLonca.Domain.Entities;
using FluentValidation;

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
