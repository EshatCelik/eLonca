using FluentValidation;

namespace eLonca.Application.Commands.CategoryCommands.CategoryCreate
{
    public class CategoryCreateValidator : AbstractValidator<CategoryCreateCommand>
    {
        public CategoryCreateValidator()
        { 
            RuleFor(x => x.TenatId).NotNull().WithMessage("Tenant bol olamaz");
            RuleFor(x => x.Name).NotNull().WithMessage("Kategory name null olamaz").MinimumLength(3).WithMessage("en az 3 karakter giriniz");
        }
    }
}
