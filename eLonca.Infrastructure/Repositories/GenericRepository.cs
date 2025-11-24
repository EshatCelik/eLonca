using eLonca.Common.Models;
using eLonca.Domain.Entities.BaseEntities;
using eLonca.Domain.Interfaces;
using eLonca.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace eLonca.Infrastructure.Repositories
{
    public class GenericRepository<T> : IGenericRepository<T> where T : BaseEntity
    {
        protected readonly LoncaDbContext _dbContext;
        protected readonly DbSet<T> _dbSet;

        public GenericRepository(LoncaDbContext dbContext)
        {
            _dbContext = dbContext;
            _dbSet = _dbContext.Set<T>();
        }

        public async Task<Result<T>> CreateAsync(T entity, CancellationToken cancellationToken)
        {
            using (var tr = await _dbContext.Database.BeginTransactionAsync(cancellationToken))
            {
                try
                {
                    await _dbSet.AddAsync(entity);
                    if (_dbContext.SaveChanges() > 0)
                    {
                        await tr.CommitAsync(cancellationToken);
                        return Result<T>.Success(entity, "Kayıt başarılı", 200);
                    }
                    else
                    {
                        return Result<T>.Failure(null, "Kayıt başarısız", 400);

                    }

                }
                catch (Exception ex)
                {

                    await tr.RollbackAsync(cancellationToken);
                    return Result<T>.Failure(new List<string>() { ex.Message }, $"{typeof(T).Name} bulunamadı ,kayıt başarısız ", 404);
                }
            }
        }

        public async Task<Result> DeleteAsync(T entity, CancellationToken cancellationToken)
        {
            using (var tr = await _dbContext.Database.BeginTransactionAsync(cancellationToken))
            {
                try
                {
                    if (entity.IsActive == false && entity.IsDeleted == true)
                        return Result.Failure($" daha önce silinmiş, tekrar silemezsiniz", null, 400);

                    _dbSet.Remove(entity);
                    var ss = _dbContext.SaveChanges();
                    await tr.CommitAsync(cancellationToken);
                    return Result.Success("Silme  başarılı", 200);


                }
                catch (Exception ex)
                {
                    await tr.RollbackAsync(cancellationToken);
                    return Result.Failure("Silme işlemi sırasında hata alındı", new List<string>() { ex.Message }, 400);
                }
            }
        }

        public async Task<Result<List<T>>> GetAllAsync(CancellationToken cancellationToken)
        {
            var list = await _dbSet.ToListAsync();
            return Result<List<T>>.Success(await _dbSet.ToListAsync(), "Liste başarılı", 200);
        }

        public async Task<Result<T>> GetByIdAsync(Guid Id)
        {
            var list = await _dbSet.Where(x => x.Id == Id).FirstOrDefaultAsync();
            return Result<T>.Success(list, "Liste başarılı", 200);
        }

        public async Task<Result<T>> Update(T entity, CancellationToken cancellationToken)
        {
            try
            {

                _dbSet.Update(entity);
                await _dbContext.SaveChangesAsync();
                return Result<T>.Success(entity, "Güncelleme başarılı", 200);

            }
            catch (Exception ex)
            {
                return Result<T>.Failure(new List<string>() { ex.Message }, $"{typeof(T).Name} bulunamadı ,güncelleme yapılırken hata alındı", 404);
            }
        }
    }
}
