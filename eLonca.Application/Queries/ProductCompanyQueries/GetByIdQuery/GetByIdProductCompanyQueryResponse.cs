using eLonca.Common.Models;
using eLonca.Domain.Entities;
using MediatR; 

namespace eLonca.Application.Queries.ProductCompanyQueries.GetByIdQuery
{
    public class GetByIdProductCompanyQueryResponse :IRequest<Result<ProductCompany>>
    {
        public Guid Id { get; set; }
    }
}
