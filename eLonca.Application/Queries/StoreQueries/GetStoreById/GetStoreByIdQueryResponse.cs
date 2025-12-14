using eLonca.Common.Models;
using eLonca.Domain.Entities;
using MediatR;

namespace eLonca.Application.Queries.StoreQueries.GetStoreById
{
    public class GetStoreByIdQueryResponse:IRequest<Result<Store>>
    {
        public Guid? Id { get; set; }
    }

}
