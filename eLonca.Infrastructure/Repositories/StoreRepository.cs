using eLonca.Common.Models;
using eLonca.Domain.Entities;
using eLonca.Domain.Interfaces;
using eLonca.Infrastructure.Persistence;

namespace eLonca.Infrastructure.Repositories
{
    public class StoreRepository : GenericRepository<Store>, IStoreRepository
    {
        public StoreRepository(LoncaDbContext dbContext) : base(dbContext)
        {
        }

        public async Task<Result<List<Store>>> GetAllStoreForSearch(Guid storeId, string name)
        {
            var list = _dbContext.Stores.Where(x => x.Id != storeId && x.StoreName.Contains(name) && x.IsActive).ToList();
            var list2 = _dbContext.Stores.ToList();
            if (!list.Any())
            {
                return Result<List<Store>>.Failure(null, "Mağaza bulunamadı", 200);
            }
            return Result<List<Store>>.Success(list, "Liste başarılı", 200);
        }
    }
}
