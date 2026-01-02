using eLonca.Common.Models;
using eLonca.Domain.Entities;
using MediatR;

namespace eLonca.Application.Commands.ProductCompanyCommands.UpdateProductCompany
{
    public class UpdateProductCompanyCommandResponse :IRequest<Result<ProductCompany>>
    {
        public Guid Id { get; set; }
        public string Phone { get; set; }
        public string Address { get; set; } 
        public string Name { get; set; }
        public Guid StoreId { get; set; } 
    }
}
