using eLonca.Common.Models;
using eLonca.Domain.Entities;
using MediatR;

namespace eLonca.Application.Commands.CategoryCommands.CategoryDelete
{
    public class CategoryDeleteResponse : IRequest<Result<Category>>
    {
        public Guid Id { get; set; }
    }
}
