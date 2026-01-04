

namespace eLonca.Common.DTOs
{
    public class GetAllSalesDto
    {
        public string SaleDate { get; set; }  
        public string SaleUser { get; set; }  
        public string InvoiceNumber { get; set; } = string.Empty;
        public string CustomerCode { get; set; } = string.Empty;
        public decimal? TotalAmount { get; set; }
        public decimal? PaidAmount { get; set; }
        public decimal RemainingAmount { get; set; }
        public PaymentType PaymentType { get; set; }
        public PaymentStatus PaymentStatus { get; set; }
        public string? Notes { get; set; }
        public List<SaleItemDto> SaleItems { get; set; }
        public List<SaleItemDto> SaleReturnItems { get; set; }
        public StoreDto Store { get; set; }
        public string StoreName { get; set; }
        public bool IsActive { get; set; }
        public Guid StoreId { get; set; }
        public Guid SaleId { get; set; }
        public Guid Id { get; set; }
        public Guid? StoreCutomerId { get; set; } 


        // Satış mı Alış mı?
        public bool IsSale { get; set; }  // true = Satış (normal), false = Alış (gri)

        // Satıcı
        public Guid SellerStoreId { get; set; }
        public string SellerStoreName { get; set; }

        // Alıcı
        public Guid BuyerStoreId { get; set; }
        public string BuyerStoreName { get; set; }

        // Müşteri bilgileri
        public CustomerType CustomerType { get; set; }
        public double DiscountRate { get; set; }

        public DateTime CreatedAt { get; set; }

        // Frontend için yardımcı property
        public string TransactionType { get; set; }
        public string PartnerStoreName => IsSale ? BuyerStoreName : SellerStoreName;

    }
}
