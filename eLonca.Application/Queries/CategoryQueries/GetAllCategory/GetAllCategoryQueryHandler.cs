using eLonca.Application.Services.TenantService;
using eLonca.Common.Models;
using eLonca.Domain.Entities;
using eLonca.Domain.Interfaces;
using MediatR;

namespace eLonca.Application.Queries.CategoryQueries.GetAllCategory
{
    internal class GetAllCategoryQueryHandler : IRequestHandler<GetAllCategoryQueryResponse, Result<List<Category>>>
    {
        private readonly ITenantService _tenantService;
        private readonly ICategoryRepository _categoryRepository;

        public GetAllCategoryQueryHandler(ICategoryRepository categoryRepository, ITenantService tenantService)
        {
            _categoryRepository = categoryRepository;
            _tenantService = tenantService;
        }

        public async Task<Result<List<Category>>> Handle(GetAllCategoryQueryResponse request, CancellationToken cancellationToken)
        {
            var tenant = _tenantService.GetTenantId();
            if (!tenant.IsSuccess)
            {
                return Result<List<Category>>.Failure(null, "Tenant bulunamadı", 400);
            }
            var categories=await _categoryRepository.GetAllAsync(x=>x.TenantId==tenant.Data,cancellationToken);
            return Result<List<Category>>.Success(categories.Data, "Kategory Listesi", 200);
        }
    }
}
