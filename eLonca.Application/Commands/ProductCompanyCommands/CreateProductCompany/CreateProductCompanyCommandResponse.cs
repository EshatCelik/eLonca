using eLonca.Common.Models;
using eLonca.Domain.Entities;
using MediatR;

namespace eLonca.Application.Commands.ProductCompanyCommands.CreateProductCompany
{
    public class CreateProductCompanyCommandResponse : IRequest<Result<ProductCompany>>
    {
        public string? Name { get; set; }
        public string? Phone { get; set; }
        public string? Address { get; set; }
        public Guid StoreId { get; set; }
    }
}
