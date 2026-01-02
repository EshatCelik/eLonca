using eLonca.Common.Models;
using eLonca.Domain.Entities;
using MediatR; 

namespace eLonca.Application.Commands.ProductCompanyCommands.DeleteProductCompany
{
    public class DeleteProductCompanyCommandResponse :IRequest<Result<ProductCompany>>
    {
        public Guid Id { get; set; }
    }
}
