using eLonca.Domain.Entities;
using FluentValidation;

namespace eLonca.Application.Commands.StockCommands.StockUpdate
{
    public class StockUpdateCommandValidator:AbstractValidator<StockMovement>
    {
        public StockUpdateCommandValidator()
        {
            RuleFor(x => x.Notes).NotEmpty().WithMessage("not boş olamaz");
            RuleFor(x => x.Quantity).NotEmpty().WithMessage("ürün sayısı boş olamaz");
            RuleFor(x => x.StoreId).NotEmpty().WithMessage("Mağaza boş olamaz");
            RuleFor(x => x.Id).NotEmpty().NotNull().WithMessage("Id null olamaz");
        }
    }
}
