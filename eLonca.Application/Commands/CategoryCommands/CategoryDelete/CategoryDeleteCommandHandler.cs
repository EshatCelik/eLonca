using eLonca.Common.Models;
using eLonca.Domain.Entities;
using eLonca.Domain.Interfaces;
using MediatR;

namespace eLonca.Application.Commands.CategoryCommands.CategoryDelete
{
    public class CategoryDeleteCommandHandler : IRequestHandler<CategoryDeleteResponse, Result<Category>>
    {
        private readonly ICategoryRepository _categoryRepository;
        private readonly IUnitOfWork _unitOfWork;

        public CategoryDeleteCommandHandler(ICategoryRepository categoryRepository, IUnitOfWork unitOfWork)
        {
            _categoryRepository = categoryRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Result<Category>> Handle(CategoryDeleteResponse request, CancellationToken cancellationToken)
        {
            var category = await _categoryRepository.GetByIdAsync(request.Id);
            if (!category.IsSuccess)
            {
                return Result<Category>.Failure(category.Errors, category.Message, category.StatusCode);
            }
            var delete = await _categoryRepository.DeleteAsync(category.Data, cancellationToken);
            if (!delete.IsSuccess)
            {
                return Result<Category>.Failure(null, "Kategory Silinemedi", 400);
            }
            return Result<Category>.Success(category.Data, "Kategory Silindi", 200);
        }
    }
}
