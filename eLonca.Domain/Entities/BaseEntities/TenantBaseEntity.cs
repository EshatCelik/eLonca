namespace eLonca.Domain.Entities.BaseEntities
{
    public abstract class TenantBaseEntity : BaseEntity, ITenantEntity
    {
        public Guid TenantId { get; set; }
    }
}
