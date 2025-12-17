using eLonca.Application.Commands.ProfileCommand.ChangePassword;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace eLonca.Api.Controllers
{ 
    public class ProfileController : BaseController
    {
        private readonly IMediator _mediator;

        public ProfileController(IMediator mediator)
        {
            _mediator = mediator;
        }
        [HttpPost]
        public async Task<IActionResult>ChangePassword(ChangePasswordCommand changePasswordCommand)
        {
            var result= await _mediator.Send(changePasswordCommand);
            return Ok(result);
        }
    }
}
