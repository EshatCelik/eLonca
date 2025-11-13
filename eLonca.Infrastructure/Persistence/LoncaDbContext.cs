using eLonca.Application.Services.TenantService;
using eLonca.Domain.Entities;
using eLonca.Domain.Entities.BaseEntities;
using Microsoft.EntityFrameworkCore;
using System.Runtime.CompilerServices;

namespace eLonca.Infrastructure.Persistence
{
    public class LoncaDbContext : DbContext
    {
        private readonly ITenantService _tenantService;

        public LoncaDbContext(DbContextOptions<LoncaDbContext> options, ITenantService tenantService) : base(options)
        {
            _tenantService = tenantService;
        }

        public DbSet<Tenant> Tenants { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Customer> Customers { get; set; }
        //public DbSet<Category> Categories { get; set; }
        public DbSet<CustomerAccount> CustomerAccounts { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Sale> Sales { get; set; }
        public DbSet<SaleItem> SaleItems { get; set; }
        public DbSet<StockMovement> StockMovements { get; set; }
        public DbSet<Store> Stores { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            foreach (var relationship in modelBuilder.Model.GetEntityTypes()
        .SelectMany(e => e.GetForeignKeys()))
            {
                relationship.DeleteBehavior = DeleteBehavior.Restrict;
            }

            // ===== TENANT FİLTRELERİ =====
            if (_tenantService.GetTenantId() != Guid.Empty)
            {
                var tenantId = _tenantService.GetTenantId();

                modelBuilder.Entity<Customer>().HasQueryFilter(c => c.TenantId == tenantId);
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
            //var tenant = _tenantService.GetTenantId();
            var entries = ChangeTracker.Entries<BaseEntity>();
            //if (tenant == Guid.Empty)
            //    return base.SaveChanges();
            try
            {
                foreach (var entry in entries)
                {
                    switch (entry.State)
                    {
                        case EntityState.Deleted:
                            entry.Entity.DeleteAt = DateTime.Now;
                            entry.Entity.IsDeleted = true;
                            //entry.Entity.DeletedBy= GetCurrentUser()  bunu daha sonra yapacağım
                            break;
                        case EntityState.Modified:
                            entry.Entity.UpdateAt = DateTime.Now;
                            break;
                        case EntityState.Added:
                            entry.Entity.CreateAt = DateTime.Now; 
                            break;
                        default:
                            break;
                    }
                }

                return base.SaveChanges();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw;
            }
        }
    }
}
