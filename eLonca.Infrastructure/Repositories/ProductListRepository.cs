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
            var check = _dbContext.ProductLists.Where(x => x.Name == name && x.StoreId == storeId).FirstOrDefault();
            if (check != null)
            {
                return Result<ProductList>.Failure(null, "Liste adı mevcut", 400);
            }
            return Result<ProductList>.Success(check, "", 200);
        }

        public async Task<Result<List<ProductList>>> GetAllPublishProductListForDashboard()
        {
            var list = _dbContext.ProductLists.Where(x => x.IsPublish && x.IsActive).ToList();
            return Result<List<ProductList>>.Success(list, "Liste başarılı", 200);
        }

        public async Task<Result<List<ProductListItem>>> GetProductListItem(Guid listId)
        {
            var list = _dbContext.ProductListItems.Where(x => x.ProductListId == listId).ToList();
            return Result<List<ProductListItem>>.Success(list, "Liste Başarılı", 200);
        }

        public Task<Result<ProductList>> PublistProductList(Guid listId)
        {
            throw new NotImplementedException();
        }
    }
}
