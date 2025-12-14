using eLonca.Common.Models;
using eLonca.Domain.Entities;
using MediatR;

namespace eLonca.Application.Queries.CategoryQueries.GetUserById
{
    public class GetCategoryByIdResponse : IRequest<Result<Category>>
    {
        public Guid? Id { get; set; }
    }
}
