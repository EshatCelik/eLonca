using eLonca.Common.Enums;

namespace eLonca.Application.DTOs
{
    public class GetAllStockDto
    {
        public Guid? StoreId { get; set; }
        public Guid? ProductId { get; set; }
        public Guid? SaleId { get; set; }
        public MovementType MovementType { get; set; }
        public decimal Quantity { get; set; }
        public DateTime MovementDate { get; set; } 
        public Guid? ReferenceId { get; set; }
        public string? Notes { get; set; }
    }
}
