using eLonca.Common.Models;
using eLonca.Domain.Entities;
using eLonca.Domain.Interfaces;
using MediatR;

namespace eLonca.Application.Commands.CategoryCommands.CategoryCreate
{
    internal class CategoryCommandHandler : IRequestHandler<CategoryCreateCommand, Result<Category>>
    {
        private readonly ICategoryRepository _categoryRepository;

        public CategoryCommandHandler(ICategoryRepository categoryRepository)
        {
            _categoryRepository = categoryRepository;
        }

        public async Task<Result<Category>> Handle(CategoryCreateCommand request, CancellationToken cancellationToken)
        {
            var category = new Category()
            {
                Name = request.Name,
                StoreId = request.StoreId,
                TenantId = request.TenatId,
                ColorCode = request.ColorCode,
                Description = request.Description,
                ParentCategoryId=request.ParentCategoryId
            };
            var response = await _categoryRepository.CreateAsync(category, cancellationToken);
            return response;
        }
    }
}
