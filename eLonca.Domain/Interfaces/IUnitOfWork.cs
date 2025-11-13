using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace eLonca.Domain.Interfaces
{
    public interface IUnitOfWork : IDisposable
    { 

        Task<int>SaveChangeAsync(CancellationToken cancellationToken=default);
        Task BeginTransactionAsync();
        Task CommitTransactionAsync();
        Task RollbackTransactionAsync();
    }
}
