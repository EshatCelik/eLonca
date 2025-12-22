using eLonca.Domain.Entities.BaseEntities;

namespace eLonca.Domain.Entities
{
    public class SaleItem : TenantBaseEntity
    {
        public Guid? SaleId { get; set; }
        public Guid? ProductId { get; set; }
        public decimal? Quantity { get; set; }
        public decimal? UnitPrice { get; set; }
        public decimal? Discount { get; set; }
        public Double? CustomerDiscount { get; set; }
        public decimal? TotalPrice { get; set; }

        // Navigation
        public Tenant? Tenant { get; set; } = null!;
        public Sale? Sale { get; set; } = null!;
        public Product? Product { get; set; } = null!;
    }
}
