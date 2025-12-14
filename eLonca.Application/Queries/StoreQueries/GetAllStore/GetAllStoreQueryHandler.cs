using eLonca.Application.Services.TenantService;
using eLonca.Common.Models;
using eLonca.Domain.Entities;
using eLonca.Domain.Interfaces;
using MediatR;

namespace eLonca.Application.Queries.StoreQueries.GetAllStore
{
    public class GetAllStoreQueryHandler : IRequestHandler<GetAllStoreQueryResponse, Result<List<Store>>>
    {
        private readonly ITenantService _tenantService;
        private readonly IStoreRepository _storeRepository;
        public GetAllStoreQueryHandler(ITenantService tenantService, IStoreRepository storeRepository)
        {
            _tenantService = tenantService;
            _storeRepository = storeRepository;
        }

        public async Task<Result<List<Store>>> Handle(GetAllStoreQueryResponse request, CancellationToken cancellationToken)
        {
            var tenant = _tenantService.GetTenantId();
            if (!tenant.IsSuccess)
            {
                return Result<List<Store>>.Failure(null, "Tenant bulunamadı", 400);
            }
            var stores = await _storeRepository.GetAllAsync(x => x.TenantId == tenant.Data);
            return Result<List<Store>>.Success(stores.Data, "Store List", 200);

        }
    }
}
