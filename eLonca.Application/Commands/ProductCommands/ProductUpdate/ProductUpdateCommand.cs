using eLonca.Common.Models;
using eLonca.Domain.Entities;
using MediatR;

namespace eLonca.Application.Commands.ProductCommands.ProductUpdate
{
    public class ProductUpdateCommand:IRequest<Result<Product>>
    {
        public Guid Id { get; set; }
        public string ProductCode { get; set; } = string.Empty;
        public string ProductName { get; set; } = string.Empty;
        public decimal PurchasePrice { get; set; } // Satın alma fiyatı
        public decimal SalePrice { get; set; } //Satış fiyatı
        public decimal RetailPrice { get; set; } //Perakende satış
        public decimal WholesalePrice { get; set; } //Toptan Fiyat satış
        public decimal MinStockLevel { get; set; }
        public string Unit { get; set; } = "Adet";
        public string? Description { get; set; }
        public string? ImageUrl { get; set; } //TOD0: daha sonra resim eklenecek
        public string? Barcode { get; set; }
        public Guid? CategoryId { get; set; }
    }
}
