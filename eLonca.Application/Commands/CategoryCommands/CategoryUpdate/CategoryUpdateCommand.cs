using eLonca.Common.Models;
using eLonca.Domain.Entities;
using MediatR;

namespace eLonca.Application.Commands.CategoryCommands.CategoryUpdate
{
    public class CategoryUpdateCommand:IRequest<Result<Category>>
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string? Color { get; set; }
        public bool IsActive { get; set; }
        public Guid StoreId { get; set; }
        public Guid? ParentCategoryId { get; set; }
    }
}
