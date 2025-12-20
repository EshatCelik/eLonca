using eLonca.Common.Models;
using eLonca.Domain.Entities;
using MediatR;

namespace eLonca.Application.Queries.SalesQueries.GetSaleById
{
    public class GetSaleByIdResponse :IRequest<Result<Sale>>
    {
        public Guid Id { get; set; }
    }
}
