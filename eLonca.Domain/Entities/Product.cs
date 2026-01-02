using eLonca.Domain.Entities.BaseEntities;
using System.Text.Json.Serialization;

namespace eLonca.Domain.Entities
{
    public class Product :TenantBaseEntity
    {
        public string ProductCode { get; set; } = string.Empty;
        public string ProductName { get; set; } = string.Empty;
        public decimal PurchasePrice { get; set; }
        public decimal SalePrice { get; set; }
        public decimal RetailPrice { get; set; } //Perakende satış
        public decimal WholesalePrice { get; set; } //Toptan Fiyat satış 
        public decimal MinStockLevel { get; set; }
        public string Unit { get; set; } = "Adet";
        public string? Description { get; set; }
        public string? ImageUrl { get; set; }
        public string? Barcode { get; set; }

        // Navigation 
        public Tenant Tenant { get; set; } = null!;
        public Guid StoreId { get; set; }
        public Store Store { get; set; } = null!;
        public Guid CategoryId { get; set; }
        public Category Category { get; set; }
        [JsonIgnore]
        public virtual ICollection<SaleItem> SaleItems { get; set; } = new List<SaleItem>();
        [JsonIgnore]
        public virtual ICollection<StockMovement> StockMovements { get; set; } = new List<StockMovement>();
    }
}
