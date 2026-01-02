using eLonca.Common.Models;
using eLonca.Domain.Entities;
using MediatR; 

namespace eLonca.Application.Queries.ProductCompanyQueries.GetAll
{
    public class GetAllProductCompanyQueryResponse : IRequest<Result<List<ProductCompany>>>
    { 
        public Guid StoreId { get; set; }
    }
}
