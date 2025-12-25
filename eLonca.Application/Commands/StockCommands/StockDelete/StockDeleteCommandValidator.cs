using FluentValidation;

namespace eLonca.Application.Commands.StockCommands.StockDelete
{
    public class StockDeleteCommandValidator:AbstractValidator<StockDeleteCommand>
    {
        public StockDeleteCommandValidator()
        {
            RuleFor(x => x.ProductId).NotEmpty().WithMessage("Ürün Id null olamaz");
        }
    }
}
