using eLonca.Domain.Entities.BaseEntities; 

namespace eLonca.Domain.Entities
{
    public class StockMovement : TenantBaseEntity
    {
        public Guid StoreId { get; set; }
        public Guid ProductId { get; set; }
        public MovementType MovementType { get; set; }
        public decimal Quantity { get; set; }
        public DateTime MovementDate { get; set; } = DateTime.UtcNow;
        public Guid? ReferenceId { get; set; }
        public string? Notes { get; set; }

        // Navigation
        public Tenant Tenant { get; set; } = null!;
        public Store Store { get; set; } = null!;
        public Product Product { get; set; } = null!;
    }

    public enum MovementType
    {
        In = 1,
        Out = 2,
        Adjustment = 3,
        Return = 4
    }
}
