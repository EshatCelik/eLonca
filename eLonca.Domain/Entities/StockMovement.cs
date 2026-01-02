using eLonca.Common.Enums;
using eLonca.Domain.Entities.BaseEntities; 

namespace eLonca.Domain.Entities
{
    public class StockMovement : TenantBaseEntity
    {
        public Guid? StoreId { get; set; }
        public Guid? ProductId { get; set; }
        public Guid? CompanyId { get; set; }
        public Guid? SaleId { get; set; }
        public MovementType MovementType { get; set; }
        public decimal Quantity { get; set; }
        public DateTime MovementDate { get; set; } = DateTime.UtcNow;
        public Guid? ReferenceId { get; set; }
        public string? Notes { get; set; }

        // Navigation
        public ProductCompany? Company { get; set; } = null!;
        public Tenant Tenant { get; set; } = null!;
        public Sale? Sale { get; set; } = null!;
        public Store? Store { get; set; } = null!;
        public Product? Product { get; set; } = null!;
    }
}
