using eLonca.Common.Models;
using eLonca.Domain.Entities;
using MediatR;

namespace eLonca.Application.Queries.StoreQueries
{
    public class GetAllStoreQueryResponse:IRequest<Result<List<Store>>>
    {
        public Guid? TenantId { get; set; }
    }
}
