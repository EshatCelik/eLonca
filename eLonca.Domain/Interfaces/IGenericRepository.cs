using eLonca.Common.Models;
using eLonca.Domain.Entities.BaseEntities;
using System.Linq.Expressions;

namespace eLonca.Domain.Interfaces
{
    public interface IGenericRepository<T> where T : BaseEntity
    {
        Task<Result<T>> CreateAsync(T entity, CancellationToken cancellationToken);
        Task<Result> DeleteAsync(T Entitiy, CancellationToken cancellationToken);
        Task<Result<List<T>>> GetAllAsync(Expression<Func<T, bool>> predicate = null, CancellationToken cancellationToken = default);
        Task<Result<T>> GetByIdAsync(Guid? Id);
        Task<Result<T>> Update(T entity, CancellationToken cancellationToken);
    }
}
