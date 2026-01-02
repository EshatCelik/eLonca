using eLonca.Common.Enums; 

namespace eLonca.Common.DTOs
{
    public class StockMovementDto
    {
        public Guid? StoreId { get; set; }
        public Guid? ProductId { get; set; }
        public string ProductName { get; set; }
        public string ProductCode { get; set; }
        public Guid? SaleId { get; set; }
        public MovementType MovementType { get; set; }
        public decimal StockInQuantity { get; set; }
        public decimal StockOutQuantity { get; set; }
        public decimal StockRemainingQuantity { get; set; }
        public decimal StockAdjustmentQuantity { get; set; }
        public decimal MinStockLevel { get; set; }
        public decimal ProductSalePrice { get; set; }
        public decimal ProductPurchasePrice { get; set; }
        public decimal Quantity { get; set; }
        public DateTime MovementDate { get; set; } = DateTime.UtcNow; 
        public string? Notes { get; set; } 
        public string? StoreName { get; set; } 
        public string? CompanyName { get; set; } 
        public string? StockCreateUserName { get; set; } 
    }
}
