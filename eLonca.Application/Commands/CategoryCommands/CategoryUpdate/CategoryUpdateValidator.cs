using FluentValidation;

namespace eLonca.Application.Commands.CategoryCommands.CategoryUpdate
{
    public class CategoryUpdateValidator:AbstractValidator<CategoryUpdateCommand>
    {
        public CategoryUpdateValidator()
        {
            RuleFor(x => x.StoreId).NotNull().WithMessage("store boş olamaz");
            RuleFor(x => x.Color).NotNull().WithMessage("Renk boş olamaz");
            RuleFor(x => x.Name).NotNull().WithMessage("Kategory name null olamaz").MinimumLength(3).WithMessage("en az 3 karakter giriniz");
        }
    }
}
