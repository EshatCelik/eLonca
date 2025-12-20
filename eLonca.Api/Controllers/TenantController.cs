using eLonca.Application.Commands.Tenants.CreateTenant;
using eLonca.Application.Commands.Tenants.DeleteTenant;
using eLonca.Application.Queries.TenantQueries.GetAllTenant;
using eLonca.Application.Queries.TenantQueries.GetTenantById;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace eLonca.Api.Controllers
{
    public class TenantController : BaseController
    {
        private readonly IMediator _mediator;

        public TenantController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateTenantCommand createTenantCommand)
        {
            var response = await _mediator.Send(createTenantCommand);
            return Ok(response);
        }
        [HttpPost]
        public async Task<IActionResult> Delete(TenantDeleteResponse deleteTenantResponse)
        {
            var reponse = _mediator.Send(deleteTenantResponse);
            return Ok(reponse);
        }
        [HttpPost]
        public async Task<IActionResult> GetAll(GetAllTenantResponse getAllTenantResponse)
        {
            var response = await _mediator.Send(getAllTenantResponse);
            return Ok(response);
        }
        [HttpPost]
        public async Task<IActionResult> GetById(GetTenantByIdQueryResponse getTenantByIdResponse)
        {
            var response = await _mediator.Send(getTenantByIdResponse);
            return Ok(response);
        }
    }
}
