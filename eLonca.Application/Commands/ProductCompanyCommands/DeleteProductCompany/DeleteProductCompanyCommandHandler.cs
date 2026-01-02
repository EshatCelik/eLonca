using eLonca.Common.Models;
using eLonca.Domain.Entities;
using eLonca.Domain.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace eLonca.Application.Commands.ProductCompanyCommands.DeleteProductCompany
{
    public class DeleteProductCompanyCommandHandler : IRequestHandler<DeleteProductCompanyCommandResponse, Result<ProductCompany>>
    {
        private readonly IProductCompanyRepository _productCompanyRepository;

        public DeleteProductCompanyCommandHandler(IProductCompanyRepository productCompanyRepository)
        {
            _productCompanyRepository = productCompanyRepository;
        }

        public async Task<Result<ProductCompany>> Handle(DeleteProductCompanyCommandResponse request, CancellationToken cancellationToken)
        {
            var entity = await _productCompanyRepository.GetByIdAsync(request.Id);
            if (entity == null)
            {
                return entity;
            }
            var response = await _productCompanyRepository.DeleteAsync(entity.Data, cancellationToken);
            if (!response.IsSuccess)
            {
                return Result<ProductCompany>.Failure(response.Errors, response.Message, response.StatusCode);
            }
            return Result<ProductCompany>.Success(entity.Data, response.Message, response.StatusCode);

        }
    }
}
