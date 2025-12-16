 

namespace eLonca.Common.DTOs
{
    public class StoreCustomerDto
    {
        public Guid Id { get; set; }
        public Guid StoreId { get; set; }
        public Guid CustomerId { get; set; }
        public string StoreName { get; set; }
        public string Address { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        public string TaxNumber { get; set; }
        public string LogoUrl { get; set; } 
        public string CustomerCode { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreateAt { get; set; }

        public CustomerType CustomerType { get; set; }
        public decimal DiscountRate { get; set; }

    }
}
