using eLonca.Common.Models;
using eLonca.Domain.Entities;
using eLonca.Domain.Interfaces;
using MediatR; 

namespace eLonca.Application.Queries.ProductCompanyQueries.GetByIdQuery
{
    public class GetByIdProductCompanyQueryHandler : IRequestHandler<GetByIdProductCompanyQueryResponse, Result<ProductCompany>>
    {
        private readonly IProductCompanyRepository _productCompanyRepository;

        public GetByIdProductCompanyQueryHandler(IProductCompanyRepository productCompanyRepository)
        {
            _productCompanyRepository = productCompanyRepository;
        }

        public async Task<Result<ProductCompany>> Handle(GetByIdProductCompanyQueryResponse request, CancellationToken cancellationToken)
        {
            var company = await _productCompanyRepository.GetByIdAsync(request.Id);            
            return company;
        }
    }
}
