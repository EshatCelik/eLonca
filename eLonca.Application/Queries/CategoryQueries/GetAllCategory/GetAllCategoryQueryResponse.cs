using eLonca.Common.Models;
using eLonca.Domain.Entities;
using MediatR;

namespace eLonca.Application.Queries.CategoryQueries.GetAllCategory
{
    public class GetAllCategoryQueryResponse:IRequest<Result<List<Category>>>
    {
        public Guid? TenantId { get; set; }
    }
}
