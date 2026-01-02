using eLonca.Common.Models;
using eLonca.Domain.Entities; 

namespace eLonca.Domain.Interfaces
{
    public interface IProductCompanyRepository : IGenericRepository<ProductCompany>
    {
        Task<Result<ProductCompany>> CheckCompanyName(string companyName,Guid StoreId);
    }
}
