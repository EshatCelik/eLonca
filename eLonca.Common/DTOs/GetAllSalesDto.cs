 

namespace eLonca.Common.DTOs
{
    public class GetAllSalesDto
    {
        public DateTime SaleDate { get; set; } = DateTime.UtcNow;
        public string InvoiceNumber { get; set; } = string.Empty;
        public decimal? TotalAmount { get; set; }
        public decimal? PaidAmount { get; set; }
        public decimal RemainingAmount { get; set; }
        public PaymentType PaymentType { get; set; }
        public PaymentStatus PaymentStatus { get; set; }
        public string? Notes { get; set; }
        public SaleItemDto SaleItems { get; set; }

    }
}
