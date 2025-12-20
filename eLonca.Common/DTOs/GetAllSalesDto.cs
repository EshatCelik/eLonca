

namespace eLonca.Common.DTOs
{
    public class GetAllSalesDto
    {
        public string SaleDate { get; set; }  
        public string InvoiceNumber { get; set; } = string.Empty;
        public string CustomerCode { get; set; } = string.Empty;
        public decimal? TotalAmount { get; set; }
        public decimal? PaidAmount { get; set; }
        public decimal RemainingAmount { get; set; }
        public PaymentType PaymentType { get; set; }
        public PaymentStatus PaymentStatus { get; set; }
        public string? Notes { get; set; }
        public List<SaleItemDto> SaleItems { get; set; }
        public StoreDto Store { get; set; }
        public string StoreName { get; set; }
        public bool IsActive { get; set; }
        public Guid StoreId { get; set; }
        public Guid Id { get; set; }
        public Guid? StoreCutomerId { get; set; }

    }
}
