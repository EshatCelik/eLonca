using eLonca.Application.Services.TenantService;
using eLonca.Domain.Entities;
using eLonca.Domain.Entities.BaseEntities;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace eLonca.Infrastructure.Persistence
{
    public class LoncaDbContext : DbContext
    {
        private readonly ITenantService _tenantService;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public LoncaDbContext(DbContextOptions<LoncaDbContext> options, ITenantService tenantService, IHttpContextAccessor contextAccessor) : base(options)
        {
            _tenantService = tenantService;
            _httpContextAccessor = contextAccessor;
        }

        public DbSet<Tenant> Tenants { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<StoreCustomer> StoreCustomers { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<CustomerAccount> CustomerAccounts { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Sale> Sales { get; set; }
        public DbSet<SaleItem> SaleItems { get; set; }
        public DbSet<StockMovement> StockMovements { get; set; }
        public DbSet<Store> Stores { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<StoreCustomer>(entity =>
            {
                // Ana mağaza ilişkisi
                entity.HasOne(sc => sc.Store)
                    .WithMany() // veya Store'da bir collection varsa: .WithMany(s => s.StoreCustomers)
                    .HasForeignKey(sc => sc.StoreId)
                    .OnDelete(DeleteBehavior.Restrict); // Cascade delete sorunları önlemek için 

            });

            foreach (var relationship in modelBuilder.Model.GetEntityTypes()
        .SelectMany(e => e.GetForeignKeys()))
            {
                relationship.DeleteBehavior = DeleteBehavior.Restrict;
            }

            var tenantId = GetTenantId();
            // ===== TENANT FİLTRELERİ =====
            if (tenantId != Guid.Empty)
            {

                modelBuilder.Entity<StoreCustomer>().HasQueryFilter(c => c.TenantId == tenantId);
                modelBuilder.Entity<User>().HasQueryFilter(u => u.TenantId == tenantId);
                modelBuilder.Entity<Category>().HasQueryFilter(c => c.TenantId == tenantId);
                modelBuilder.Entity<CustomerAccount>().HasQueryFilter(ca => ca.TenantId == tenantId);
                modelBuilder.Entity<Payment>().HasQueryFilter(p => p.TenantId == tenantId);
                modelBuilder.Entity<Product>().HasQueryFilter(p => p.TenantId == tenantId);
                modelBuilder.Entity<Sale>().HasQueryFilter(s => s.TenantId == tenantId);
                modelBuilder.Entity<SaleItem>().HasQueryFilter(si => si.TenantId == tenantId);
                modelBuilder.Entity<StockMovement>().HasQueryFilter(sm => sm.TenantId == tenantId);
                modelBuilder.Entity<Store>().HasQueryFilter(s => s.TenantId == tenantId);
            }

            base.OnModelCreating(modelBuilder);
        }

        public override int SaveChanges()
        {
            var tenantId = GetTenantId();
            if (tenantId == Guid.Empty)
                return 0;
            var entries = ChangeTracker.Entries<BaseEntity>(); 
            try
            {
                foreach (var entry in entries)
                {
                    switch (entry.State)
                    {
                        case EntityState.Deleted:
                            entry.State = EntityState.Modified;
                            entry.Entity.DeleteAt = DateTime.Now;
                            entry.Entity.IsDeleted = true;
                            entry.Entity.IsActive = false;
                            entry.Entity.DeletedBy = Guid.Parse(_httpContextAccessor.HttpContext?.User.FindFirst("UserId")?.Value);
                            break;
                        case EntityState.Modified:
                            entry.State = EntityState.Modified;
                            entry.Entity.UpdateAt = DateTime.Now;
                            entry.Entity.UpdatedBy = Guid.Parse(_httpContextAccessor.HttpContext?.User.FindFirst("UserId")?.Value);
                            break;
                        case EntityState.Added:
                            entry.Entity.CreateAt = DateTime.Now;
                            entry.Entity.IsDeleted = false;
                            entry.Entity.IsActive = true;
                            if (entry.Entity is ITenantEntity tenantEntity)
                            {
                                tenantEntity.TenantId = tenantId;
                            }
                            entry.Entity.CreatedBy = Guid.Parse(_httpContextAccessor.HttpContext?.User.FindFirst("UserId")?.Value);
                            break;
                        default:
                            break;
                    }
                }
                return base.SaveChanges();

            }
            catch (Exception ex)
            {
                throw;
            }
        }
        private Guid GetTenantId()
        {
            var tenant = _httpContextAccessor.HttpContext?.User.FindFirst("TenantId")?.Value;
            if (tenant == null)
            {
                return Guid.Empty;
            }
            return Guid.Parse(tenant);
        }
    }
}
