using eLonca.Common.Models;
using eLonca.Domain.Entities;
using eLonca.Domain.Interfaces;
using MediatR; 

namespace eLonca.Application.Commands.ProductCompanyCommands.CreateProductCompany
{
    public class CreateProductCompanyCommandHandler : IRequestHandler<CreateProductCompanyCommandResponse, Result<ProductCompany>>
    {
        private readonly IProductCompanyRepository _productCompanyRepository;

        public CreateProductCompanyCommandHandler(IProductCompanyRepository productCompanyRepository)
        {
            _productCompanyRepository = productCompanyRepository;
        }

        public async Task<Result<ProductCompany>> Handle(CreateProductCompanyCommandResponse request, CancellationToken cancellationToken)
        {
            var check = await _productCompanyRepository.CheckCompanyName(request.Name, request.StoreId);
            if (!check.IsSuccess)
            {
                return check;
            }
            var company = new ProductCompany()
            {
                Name = request.Name,
                CompanyCode = DateTime.Now.Date.Year + "CRM" + request.Name,
                StoreId = request.StoreId,
                Phone = request.Phone,
                Address = request.Address,

            };

            var response= await _productCompanyRepository.CreateAsync(company,cancellationToken);
            return response;
        }
    }
}
