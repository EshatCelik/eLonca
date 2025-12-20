using eLonca.Common.Models;
using eLonca.Domain.Entities;
using eLonca.Domain.Interfaces;
using MediatR;

namespace eLonca.Application.Queries.CustomerQueries.GetAllCustomerByName
{
    public class GetAllCustomerByNameQueryHandler : IRequestHandler<GetAllStoreByNameQueryResponse, Result<List<Store>>>
    {
        private readonly IStoreRepository _storeRepository;

        public GetAllCustomerByNameQueryHandler(IStoreRepository storeRepository)
        {
            _storeRepository = storeRepository;
        }

        public async Task<Result<List<Store>>> Handle(GetAllStoreByNameQueryResponse request, CancellationToken cancellationToken)
        {
            var stores = await _storeRepository.GetAllStoreForSearch(request.StoreId, request.StoreName);
            return stores;
        }
    }
}
