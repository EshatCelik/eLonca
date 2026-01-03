using eLonca.Common.DTOs;
using eLonca.Common.Models;
using eLonca.Domain.Entities;
using MediatR;

namespace eLonca.Application.Queries.SalesQueries.GetAllSale
{
    public class GetAllSalesQueryResponse:IRequest<Result<List<GetAllSalesDto>>>
    {
        public Guid StoreId { get; set; }
        public Guid StoreCustomerId { get; set; }
    }
}
