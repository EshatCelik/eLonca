using FluentValidation;

namespace eLonca.Application.Commands.StoreCommands.StoreDelete
{
    public class StoreDeleteValidator:AbstractValidator<StoreDeleteCommand>
    {
        public StoreDeleteValidator()
        {
            RuleFor(x => x.Id).NotEmpty().WithMessage(" mağaza Id boş olamaz");
        }
    }
}
