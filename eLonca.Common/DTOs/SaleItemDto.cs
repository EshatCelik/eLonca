namespace eLonca.Common.DTOs
{
    public class SaleItemDto
    {
        public Guid? SaleId { get; set; }
        public Guid? ProductId { get; set; }
        public decimal? Quantity { get; set; }
        public decimal? UnitPrice { get; set; }
        public decimal? Discount { get; set; }
        public decimal? CustomerDiscount { get; set; }
        public decimal? TotalPrice { get; set; }
    }
}
