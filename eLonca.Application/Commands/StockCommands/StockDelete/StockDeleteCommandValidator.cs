using FluentValidation;

namespace eLonca.Application.Commands.StockCommands.StockDelete
{
    public class StockDeleteCommandValidator:AbstractValidator<StockDeleteCommand>
    {
        public StockDeleteCommandValidator()
        {
            RuleFor(x => x.StockId).NotEmpty().WithMessage("Stok Id null olamaz");
        }
    }
}
