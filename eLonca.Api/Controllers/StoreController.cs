using eLonca.Application.Commands.StoreCommands.StoreCreate;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace eLonca.Api.Controllers
{
    //[Authorize]
    public class StoreController : BaseController
    {
        private readonly IMediator _mediator;

        public StoreController(IMediator mediator)
        {
            _mediator = mediator;
        }
        //[Authorize]
        [HttpPost]
        public async Task<IActionResult> Create(StoreCreateCommand command)
        {
            var result = await _mediator.Send(command);
            return Ok(result);
        }
    }
}
