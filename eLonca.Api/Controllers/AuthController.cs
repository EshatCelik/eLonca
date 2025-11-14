using eLonca.Application.Commands.AuthCommands.LoginCommand;
using eLonca.Application.Commands.AuthCommands.RegisterCommand;
using eLonca.Application.Services.AuthService;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace eLonca.Api.Controllers
{ 
    public class AuthController : BaseController
    {
        private readonly IAuthService _authService;
        private readonly IMediator _mediator;

        public AuthController(IAuthService authService, IMediator mediator)
        {
            _authService = authService;
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
    }
}
