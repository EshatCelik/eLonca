using eLonca.Application.Queries.CategoryQueries.GetUserById;
using eLonca.Common.Models;
using eLonca.Domain.Entities;
using eLonca.Domain.Interfaces;
using MediatR;

namespace eLonca.Application.Queries.UserQueries.GetUserById
{
    public class GetCategoryByIdQueryHandler : IRequestHandler<GetCategoryByIdResponse, Result<Category>>
    { 
        private readonly ICategoryRepository _categoryRepository;

        public GetCategoryByIdQueryHandler(ICategoryRepository categoryRepository)
        {
            _categoryRepository = categoryRepository;
        }

        public async Task<Result<Category>> Handle(GetCategoryByIdResponse request, CancellationToken cancellationToken)
        {
            var category = await _categoryRepository.GetByIdAsync(request.Id);
            if (!category.IsSuccess)
            {
                return Result<Category>.Failure(null, "User bulunamadı", 400);
            }
            return category;
        }
    }
}
