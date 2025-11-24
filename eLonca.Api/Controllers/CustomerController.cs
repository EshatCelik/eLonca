using MediatR; 
using Microsoft.AspNetCore.Mvc;
using eLonca.Application.Commands.CustomerCommands.CustomerCreate;

namespace eLonca.Api.Controllers
{
    public class CustomerController : BaseController
    {
        private readonly IMediator _mediator;
        public CustomerController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost]
        public async Task<IActionResult> Create(CustomerCreateCommand customerCreateCommand)
        {
            var repsonse = await _mediator.Send(customerCreateCommand);
            return Ok(repsonse);
        }

        [HttpPost]
        public async Task<IActionResult> Update(CustomerUpdateCommand customerCreateCommand)
        {
            var repsonse = await _mediator.Send(customerCreateCommand);
            return Ok(repsonse);
        }
    }
}
