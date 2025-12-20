using eLonca.Common.Models;
using eLonca.Domain.Entities;
using MediatR;

namespace eLonca.Application.Queries.CustomerQueries.GetAllCustomerByName
{
    public class GetAllStoreByNameQueryResponse : IRequest<Result<List<Store>>>
    {
        public string StoreName { get; set; }
        public Guid  StoreId { get; set; }
    }
}
