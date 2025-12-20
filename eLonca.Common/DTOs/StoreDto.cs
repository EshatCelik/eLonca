namespace eLonca.Common.DTOs
{
    public class StoreDto
    {
        public string StoreName { get; set; }
        public string Address { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        public string TaxNumber { get; set; }
        public string LogoUrl { get; set; }
        public Guid TenanId { get; set; }
        public virtual ICollection<object> Products { get; set; }

        public virtual ICollection<object> StoreCustomers { get; set; }

        public virtual ICollection<object> Sales { get; set; }

        public virtual ICollection<object> Categories { get; set; }
        public virtual ICollection<object> Users { get; set; } = new List<object>();
    }
}
