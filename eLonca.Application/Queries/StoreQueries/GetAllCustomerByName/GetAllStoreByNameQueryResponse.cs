using eLonca.Common.Models;
using eLonca.Domain.Entities;
using MediatR;

namespace eLonca.Application.Queries
{
    public class GetAllStoreByNameQueryResponse : IRequest<Result<List<Store>>>
    {
        public string StoreName { get; set; }
    }
}
