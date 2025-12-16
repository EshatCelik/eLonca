using eLonca.Common.Models;
using eLonca.Domain.Entities;
using eLonca.Domain.Interfaces;
using MediatR;

namespace eLonca.Application.Commands.CategoryCommands.CategoryUpdate
{
    public class CategoryUpdateCommandHandler : IRequestHandler<CategoryUpdateCommand, Result<Category>>
    {
        private readonly ICategoryRepository _categoryRepository;

        public CategoryUpdateCommandHandler(ICategoryRepository categoryRepository)
        {
            _categoryRepository = categoryRepository;
        }

        public async Task<Result<Category>> Handle(CategoryUpdateCommand request, CancellationToken cancellationToken)
        {
            var category = await _categoryRepository.GetByIdAsync(request.Id);
            if (!category.IsSuccess)
            {
                return Result<Category>.Failure(category.Errors, category.Message, category.StatusCode);
            }
            var updatedCategory = category.Data;
            updatedCategory.StoreId = request.StoreId;
            updatedCategory.Name = request.Name;
            updatedCategory.ColorCode = request.Color;
            updatedCategory.Description = request.Description;
            updatedCategory.IsActive = request.IsActive;

            var result = await _categoryRepository.Update(updatedCategory, cancellationToken);
            return result;
        }

    }
}
