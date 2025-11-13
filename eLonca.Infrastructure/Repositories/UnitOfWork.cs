using eLonca.Domain.Interfaces;
using eLonca.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore.Storage;

namespace eLonca.Infrastructure.Repositories
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly LoncaDbContext _dbContext;
        private  IDbContextTransaction _transaction;

        public UnitOfWork(LoncaDbContext dbContext)
        {
            _dbContext = dbContext; 
        }
        public async Task<int> SaveChangeAsync(CancellationToken cancellationToken = default)
        {
            return await _dbContext.SaveChangesAsync(cancellationToken);
        }

        public async Task BeginTransactionAsync()
        {
           _transaction=  await _dbContext.Database.BeginTransactionAsync();
        }

        public async Task CommitTransactionAsync()
        {
            try
            {
                await _dbContext.SaveChangesAsync();
                await _transaction.CommitAsync();
            }
            catch (Exception)
            {

                await _transaction.RollbackAsync();
                throw;
            }
            finally
            {
                _transaction?.Dispose();
                _transaction = null;
            }
        }

        public void Dispose()
        { 
            _transaction?.Dispose();
            _dbContext.Dispose();
        }

        public async Task RollbackTransactionAsync()
        {
            if (_transaction != null)
            {
                await _transaction.RollbackAsync();
                _transaction?.Dispose();
                _transaction=null;
            }
        }

    }
}
