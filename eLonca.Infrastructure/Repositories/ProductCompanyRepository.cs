using eLonca.Common.Models;
using eLonca.Domain.Entities;
using eLonca.Domain.Interfaces;
using eLonca.Infrastructure.Persistence;

namespace eLonca.Infrastructure.Repositories
{
    public class ProductCompanyRepository : GenericRepository<ProductCompany>, IProductCompanyRepository
    {
        public ProductCompanyRepository(LoncaDbContext dbContext) : base(dbContext)
        {
        }

        public async Task<Result<ProductCompany>> CheckCompanyName(string companyName,Guid StoreId)
        {
            var check=  _dbContext.ProductCompanies.Where(x=>x.Name.ToLower()==companyName.ToLower() && x.StoreId==StoreId).FirstOrDefault();
            if (check != null)
            {
                return Result<ProductCompany>.Failure(null, "Ürün Firması mevcut", 400);
            }
            return Result<ProductCompany>.Success(check, "Ürün Firması Değil", 200);

        }
    }
}
