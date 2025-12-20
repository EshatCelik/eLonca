using eLonca.Common.DTOs;
using eLonca.Common.Models;
using MediatR;

namespace eLonca.Application.Queries.SalesQueries.GetAllSale
{
    public class GetAllSalesQueryResponse:IRequest<Result<List<GetAllSalesDto>>>
    {
        public Guid? TenantId { get; set; }
    }
}
