using eLonca.Common.Models;
using eLonca.Domain.Entities;
using eLonca.Domain.Interfaces;
using MediatR;
using Microsoft.VisualBasic;

namespace eLonca.Application.Queries.ProductCompanyQueries.GetAll
{
    public class GetAllProductCompanyQueryHandler : IRequestHandler<GetAllProductCompanyQueryResponse, Result<List<ProductCompany>>>
    {
        private readonly IProductCompanyRepository _productCompanyRepository;

        public GetAllProductCompanyQueryHandler(IProductCompanyRepository productCompanyRepository)
        {
            _productCompanyRepository = productCompanyRepository;
        }

        public async Task<Result<List<ProductCompany>>> Handle(GetAllProductCompanyQueryResponse request, CancellationToken cancellationToken)
        {
            var list = await _productCompanyRepository.GetAllAsync(x => x.StoreId == request.StoreId && x.IsDeleted == false && x.IsActive);
            return list;
        }
    }
}
