using eLonca.Common.Models;
using eLonca.Domain.Entities;
using MediatR;

namespace eLonca.Application.Commands.ProductCommands.ProductCreate
{
    public class ProductCreateCommand:IRequest<Result<Product>>
    {
        public string ProductCode { get; set; } = string.Empty;
        public string ProductName { get; set; } = string.Empty;
        public decimal PurchasePrice { get; set; } // Satın alma fiyatı
        public decimal SalePrice { get; set; } //Satış fiyatı 
        public decimal MinStockLevel { get; set; }
        public string Unit { get; set; } = "Adet";
        public string? Description { get; set; }
        public string? ImageUrl { get; set; }
        public string? Barcode { get; set; } 
        public Guid StoreId { get; set; } 
        public Guid CategoryId { get; set; }  
        public Guid? TenantId { get; set; }  
    }
}
