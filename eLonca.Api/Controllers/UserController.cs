using eLonca.Application.Commands.UserCommands.UserCreate;
using eLonca.Application.Commands.UserCommands.UserDelete;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace eLonca.Api.Controllers
{
    public class UserController : BaseController
    {
        private readonly IMediator _mediator;

        public UserController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost]
        public async Task<IActionResult> Create(UserCreateCommand command)
        {
            var response = await _mediator.Send(command);
            return Ok(response);
        }
        [HttpPost]
        public async Task<IActionResult> Delete(UserDeleteCommand command)
        {
            var response= await _mediator.Send(command);
            return Ok(response);
        }
    }
}
