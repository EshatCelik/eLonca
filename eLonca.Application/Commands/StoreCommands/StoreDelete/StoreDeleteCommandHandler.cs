using eLonca.Common.Models;
using eLonca.Domain.Entities;
using eLonca.Domain.Interfaces;
using MediatR;

namespace eLonca.Application.Commands.StoreCommands.StoreDelete
{
    public class StoreDeleteCommandHandler : IRequestHandler<StoreDeleteCommand, Result<Store>>
    {
        private readonly IStoreRepository _storeRepository;
        private readonly IUnitOfWork _unitOfWork;

        public StoreDeleteCommandHandler(IStoreRepository storeRepository, IUnitOfWork unitOfWork)
        {
            _storeRepository = storeRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Result<Store>> Handle(StoreDeleteCommand request, CancellationToken cancellationToken)
        {
            var store = await _storeRepository.GetByIdAsync(request.Id);
            if (!store.IsSuccess)
            {
                return Result<Store>.Failure(null, "Mağaza Bulunamadı", 400);
            }
            var result = await _storeRepository.DeleteAsync(store.Data, cancellationToken);
            if (!result.IsSuccess)
            {
                return Result<Store>.Failure(result.Errors, result.Message, 400);
            }

            _ = _unitOfWork.SaveChangeAsync(cancellationToken);
            return Result<Store>.Success(store.Data, "Mağaza silindi", 200);
        }
    }
}
