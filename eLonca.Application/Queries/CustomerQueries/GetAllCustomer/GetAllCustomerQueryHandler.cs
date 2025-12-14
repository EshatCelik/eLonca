using eLonca.Application.Services.TenantService;
using eLonca.Common.Models;
using eLonca.Domain.Entities;
using eLonca.Domain.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Metadata.Ecma335;
using System.Text;
using System.Threading.Tasks;

namespace eLonca.Application.Queries.CustomerQueries.GetAllCustomer
{
    public class GetAllCustomerQueryHandler : IRequestHandler<GetAllCustomerQueryResponse, Result<List<StoreCustomer>>>
    {
        private readonly ITenantService _tenantService;
        private readonly ICustomerRepository _customerRepository;

        public GetAllCustomerQueryHandler(ICustomerRepository customerRepository, ITenantService tenantService)
        {
            _customerRepository = customerRepository;
            _tenantService = tenantService;
        }

        public async Task<Result<List<StoreCustomer>>> Handle(GetAllCustomerQueryResponse request, CancellationToken cancellationToken)
        {
            var tenant = _tenantService.GetTenantId();
            if (!tenant.IsSuccess)
            {
                return Result<List<StoreCustomer>>.Failure(null, "Tenant bulunamadı", 400);
            }
            var customer = await _customerRepository.GetAllAsync(x => x.TenantId == tenant.Data, cancellationToken);
            return Result<List<StoreCustomer>>.Success(customer.Data, "Müşteri Listesi", 200);
        }
    }
}
