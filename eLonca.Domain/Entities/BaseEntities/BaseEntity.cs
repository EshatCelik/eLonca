namespace eLonca.Domain.Entities.BaseEntities
{
    public abstract class BaseEntity
    {
        public Guid Id { get; set; }
        public DateTime CreateAt { get; set; }
        public Guid? CreatedBy { get; set; }
        public DateTime? DeleteAt { get; set; }
        public Guid? DeletedBy { get; set; }
        public DateTime? UpdateAt { get; set; }
        public Guid? UpdatedBy { get; set; }
        public bool IsDeleted { get; set; }
        public bool IsActive { get; set; }

    }
}
