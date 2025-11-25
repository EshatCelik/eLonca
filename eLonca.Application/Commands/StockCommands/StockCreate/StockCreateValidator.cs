using FluentValidation;

namespace eLonca.Application.Commands.StockCommands.StockCreate
{
    public class StockCreateValidator:AbstractValidator<StockCreateCommand>
    {
        public StockCreateValidator()
        {
            RuleFor(x => x.Notes).NotEmpty().WithMessage("not boş olamaz");
            RuleFor(x => x.Quantity).NotEmpty().WithMessage("ürün sayısı boş olamaz");
            RuleFor(x => x.StoreId).NotEmpty().WithMessage("Mağaza boş olamaz");
        }
    }
}
