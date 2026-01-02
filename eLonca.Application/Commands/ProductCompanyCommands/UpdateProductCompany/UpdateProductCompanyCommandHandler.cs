using eLonca.Common.Models;
using eLonca.Domain.Entities;
using eLonca.Domain.Interfaces;
using MediatR; 

namespace eLonca.Application.Commands.ProductCompanyCommands.UpdateProductCompany
{
    public class UpdateProductCompanyCommandHandler : IRequestHandler<UpdateProductCompanyCommandResponse, Result<ProductCompany>>
    {
        private readonly IProductCompanyRepository _productCompanyRepository;

        public UpdateProductCompanyCommandHandler(IProductCompanyRepository productCompanyRepository)
        {
            _productCompanyRepository = productCompanyRepository;
        }

        public async Task<Result<ProductCompany>> Handle(UpdateProductCompanyCommandResponse request, CancellationToken cancellationToken)
        {
            var check = await _productCompanyRepository.GetByIdAsync(request.Id);
            if (!check.IsSuccess)
            {
                return Result<ProductCompany>.Failure(null, "Firma bulunamadı", 400);
            }
            var updateData = check.Data;

            updateData.Name = request.Name;
            updateData.Phone = request.Phone;
            updateData.Address = request.Address;

            var response = _productCompanyRepository.Update(updateData, cancellationToken);
            if (!response.Result.IsSuccess)
            {
                return Result<ProductCompany>.Failure(null, response.Result.Message, 400);
            }
            return Result<ProductCompany>.Success(check.Data, "ürün güncellendi", 400);

        }
    }
}
