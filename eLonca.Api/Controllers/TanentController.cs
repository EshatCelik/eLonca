using eLonca.Application.Commands.Tenants.CreateTenant;
using eLonca.Application.Commands.Tenants.DeleteTenant;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace eLonca.Api.Controllers
{ 
    [ApiController]
    public class TanentController : BaseController
    {
        private readonly IMediator _mediator;

        public TanentController(IMediator mediator) 
        {
            _mediator = mediator;
        }

        [HttpPost]
        public async Task< IActionResult> Create(CreateTenantCommand createTenantCommand)
        {
            var response=await _mediator.Send(createTenantCommand);
            return Ok(response);
        }
        [HttpPost]
        public async Task< IActionResult> Delete(DeleteTenantResponse deleteTenantResponse)
        {
            var reponse=_mediator.Send(deleteTenantResponse);
            return Ok(reponse);
        }
    }
}
