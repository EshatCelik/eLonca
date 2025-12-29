using eLonca.Common.Models;
using eLonca.Domain.Entities;
using eLonca.Domain.Interfaces;
using eLonca.Infrastructure.Persistence;

namespace eLonca.Infrastructure.Repositories
{
    public class ProductListRepository : GenericRepository<ProductList>, IProductListRepository
    {
        public ProductListRepository(LoncaDbContext dbContext) : base(dbContext)
        {
        }

        public async Task<Result<ProductList>> CheckName(string name, Guid storeId)
        { 
            var check =_dbContext.ProductLists.Where(x=>x.Name==name && x.StoreId==storeId).FirstOrDefault();
            if (check != null)
            {
                return Result<ProductList>.Failure(null, "Liste adı mevcut", 400);
            }
            return Result<ProductList>.Success(check, "", 200);
        }
    }
}
