using eLonca.Common.Models;
using eLonca.Domain.Entities;
using MediatR;

namespace eLonca.Application.Queries.SalesQueries
{
    public class GetAllSalesQueryResponse:IRequest<Result<List<Sale>>>
    {
        public Guid? TenantId { get; set; }
    }
}
