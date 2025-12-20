using eLonca.Common.Models;
using eLonca.Domain.Entities;
using eLonca.Domain.Interfaces;
using MediatR;

namespace eLonca.Application.Queries.SalesQueries.GetSaleById
{
    public class GetSaleByIdResponseHandler : IRequestHandler<GetSaleByIdResponse, Result<Sale>>
    {
        private readonly ISaleRepository _saleRepository;

        public GetSaleByIdResponseHandler(ISaleRepository saleRepository)
        {
            _saleRepository = saleRepository;
        }

        public async Task<Result<Sale>> Handle(GetSaleByIdResponse request, CancellationToken cancellationToken)
        {
            var sale = await _saleRepository.GetByIdAsync(request.Id);
            if (!sale.IsSuccess)
            {
                return Result<Sale>.Failure(sale.Errors, sale.Message, sale.StatusCode);
            }
            return sale;
        }
    }
}
