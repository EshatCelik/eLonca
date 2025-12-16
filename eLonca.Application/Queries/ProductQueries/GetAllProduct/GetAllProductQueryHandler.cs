using eLonca.Application.Services.TenantService;
using eLonca.Common.Models;
using eLonca.Domain.Entities;
using eLonca.Domain.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace eLonca.Application.Queries.ProductQueries.GetAllProduct
{
    public class GetAllProductQueryHandler : IRequestHandler<GetAllProductQueryResponse, Result<List<Product>>>
    {
        private readonly IProductRepository _productRepository;
        private readonly ITenantService _tenantService;

        public GetAllProductQueryHandler(IProductRepository productRepository, ITenantService tenantService)
        {
            _productRepository = productRepository;
            _tenantService = tenantService;
        }

        public async Task<Result<List<Product>>> Handle(GetAllProductQueryResponse request, CancellationToken cancellationToken)
        {
            var tenant = _tenantService.GetTenantId();
            if (!tenant.IsSuccess)
            {
                return Result<List<Product>>.Failure(null, "Tenant Bulunamadı", 400);
            }
            var list = await _productRepository.GetAllAsync(x => x.TenantId == tenant.Data, cancellationToken);
            if (!list.IsSuccess)
            {
                return Result<List<Product>>.Failure(null, "Ürün Listesi bulunamadı", 400);
            }
            return list;
        }
    }
}
