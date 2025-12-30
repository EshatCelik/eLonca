using eLonca.Domain.Entities;
using eLonca.Domain.Interfaces;
using eLonca.Infrastructure.Persistence; 

namespace eLonca.Infrastructure.Repositories
{
    public class ProductListItemRepository : GenericRepository<ProductListItem>, IProductListItemRepository
    {
        public ProductListItemRepository(LoncaDbContext dbContext) : base(dbContext)
        {
        }
    }
}
