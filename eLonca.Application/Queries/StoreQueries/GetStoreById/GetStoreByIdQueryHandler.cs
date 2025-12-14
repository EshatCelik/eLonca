using eLonca.Common.Models;
using eLonca.Domain.Entities;
using eLonca.Domain.Interfaces;
using MediatR;

namespace eLonca.Application.Queries.StoreQueries.GetStoreById
{
    public class GetStoreByIdQueryHandler : IRequestHandler<GetStoreByIdQueryResponse, Result<Store>>
    { 
        private readonly IStoreRepository _storeRepository;

        public GetStoreByIdQueryHandler(IStoreRepository storeRepository)
        {
            _storeRepository = storeRepository;
        }

        public async Task<Result<Store>> Handle(GetStoreByIdQueryResponse request, CancellationToken cancellationToken)
        {
            var store = await _storeRepository.GetByIdAsync(request.Id);
            if (!store.IsSuccess)
                return Result<Store>.Failure(null, "Mağaza Bulunamadı", 400);
            return store;
        }
    }
}
