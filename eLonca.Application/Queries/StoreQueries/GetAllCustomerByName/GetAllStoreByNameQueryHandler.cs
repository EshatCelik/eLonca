using eLonca.Common.Models;
using eLonca.Domain.Entities;
using eLonca.Domain.Interfaces;
using MediatR;

namespace eLonca.Application.Queries.StoreQueries
{
    public class GetStoreByNameQueryHandler : IRequestHandler<GetAllStoreByNameQueryResponse, Result<List<Store>>>
    {
        private readonly IStoreRepository _storeRepository;

        public GetStoreByNameQueryHandler(IStoreRepository storeRepository)
        {
            _storeRepository = storeRepository;
        }

        public async Task<Result<List<Store>>> Handle(GetAllStoreByNameQueryResponse request, CancellationToken cancellationToken)
        {
            var stores= await _storeRepository.GetAllAsync(x=>x.StoreName.Contains(request.StoreName),cancellationToken);
            return stores;
        }
    }
}
