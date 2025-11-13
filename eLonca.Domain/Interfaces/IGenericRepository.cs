using eLonca.Common.Models;
using eLonca.Domain.Entities.BaseEntities;

namespace eLonca.Domain.Interfaces
{
    public interface IGenericRepository<T> where T : BaseEntity
    {
        Task<Result<T>> CreateAsync(T entity, CancellationToken cancellationToken);
        void DeleteAsync(T Entitiy);
        Task<Result<List<T>>> GetAllAsync(CancellationToken cancellationToken);
        Task<Result<T>> GetByIdAsync(Guid Id);
        Task<Result<T>> Update(T entity, CancellationToken cancellationToken);
    }
}
