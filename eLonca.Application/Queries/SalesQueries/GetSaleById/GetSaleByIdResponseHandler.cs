using eLonca.Common.DTOs;
using eLonca.Common.Models;
using eLonca.Domain.Entities;
using eLonca.Domain.Interfaces;
using MediatR;

namespace eLonca.Application.Queries.SalesQueries.GetSaleById
{
    public class GetSaleByIdResponseHandler : IRequestHandler<GetSaleByIdResponse, Result<GetAllSalesDto>>
    {
        private readonly ISaleRepository _saleRepository;

        public GetSaleByIdResponseHandler(ISaleRepository saleRepository)
        {
            _saleRepository = saleRepository;
        }

        public async Task<Result<GetAllSalesDto>> Handle(GetSaleByIdResponse request, CancellationToken cancellationToken)
        {
            var sale = await _saleRepository.GetSaleById(request.Id,cancellationToken);
            if (!sale.IsSuccess)
            {
                return Result<GetAllSalesDto>.Failure(sale.Errors, sale.Message, sale.StatusCode);
            }
            return sale;
        }
    }
}
