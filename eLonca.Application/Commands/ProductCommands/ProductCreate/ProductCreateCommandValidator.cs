using FluentValidation;

namespace eLonca.Application.Commands.ProductCommands.ProductCreate
{
    public class ProductCreateCommandValidator : AbstractValidator<ProductCreateCommand>
    {
        public ProductCreateCommandValidator()
        {
            RuleFor(x => x.ProductCode).NotEmpty().WithMessage("Product code boş olamaz").MinimumLength(3).WithMessage("en az 3 karakter olmalı");
            RuleFor(x => x.SalePrice).NotEmpty().WithMessage("Product code boş olamaz");
            RuleFor(x => x.PurchasePrice).NotEmpty().WithMessage("Satın alma fiyatı boş olamaz");
            //RuleFor(x => x.TenantId).NotEmpty().WithMessage("TenantId boş olamaz");
            RuleFor(x => x.CategoryId).NotEmpty().WithMessage("CategoryId boş olamaz");
            RuleFor(x => x.StoreId).NotEmpty().WithMessage("StoreId boş olamaz");
            RuleFor(x => x.MinStockLevel).NotEmpty().WithMessage("Stok adedi boş olamaz");
            //RuleFor(x => x.Barcode).NotEmpty().WithMessage("Barcode boş olamaz"); bu geliştirme sonradan eklenecektir
            RuleFor(x => x.Description).NotEmpty().WithMessage("Ürün açıklaması giriniz").MinimumLength(6).WithMessage("en az 6 karakter giriniz");

        }
    }
}
