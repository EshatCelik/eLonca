using eLonca.Application.Commands.AuthCommands.LoginCommand;
using eLonca.Application.Commands.AuthCommands.RefreshTokenCommand;
using eLonca.Application.Commands.AuthCommands.RegisterCommand;
using eLonca.Application.Services.AuthService;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace eLonca.Api.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IMediator _mediator;

        public AuthController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost]
        public async Task<IActionResult> Login(LoginCommand loginCommand)
        {
            var response = await _mediator.Send(loginCommand);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> Register(RegisterCommand registerCommand)
        {
            var response = await _mediator.Send(registerCommand);
            return Ok(response);
        }
        [HttpPost]
        public async Task<IActionResult>RefreshToken(RefreshTokenCommand refreshTokenCommand)
        {
           var response= await _mediator.Send(refreshTokenCommand);
            return Ok(response);
        }
    }
}
