using eLonca.Common.DTOs;
using eLonca.Common.Models;
using eLonca.Domain.Entities;
using MediatR;

namespace eLonca.Application.Queries.SalesQueries.GetSaleById
{
    public class GetSaleByIdResponse :IRequest<Result<GetAllSalesDto>>
    {
        public Guid Id { get; set; }
    }
}
