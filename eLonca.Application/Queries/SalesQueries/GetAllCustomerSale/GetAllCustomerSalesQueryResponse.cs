using eLonca.Common.DTOs;
using eLonca.Common.Models;
using MediatR;

namespace eLonca.Application.Queries.SalesQueries 
{
    public class GetAllCustomerSalesQueryResponse : IRequest<Result<List<GetAllSalesDto>>>
    {
        public Guid StoreId { get; set; }
        public Guid StoreCustomerId { get; set; }
    }
}
