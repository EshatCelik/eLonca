using eLonca.Common.Models;
using eLonca.Domain.Entities;
using MediatR;

namespace eLonca.Application.Commands.CategoryCommands.CategoryCreate
{
    public class CategoryCreateCommand : IRequest<Result<Category>>
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public string ColorCode { get; set; } 
        public Guid TenatId { get; set; }
        public Guid StoreId { get; set; }
        public Guid? ParentCategoryId { get; set; }
    }
}
