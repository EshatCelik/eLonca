using eLonca.Application.Commands.UserCommands.UserCreate;
using eLonca.Application.Commands.UserCommands.UserDelete;
using eLonca.Application.Commands.UserCommands.UserUpdate;
using eLonca.Application.Queries.UserQueries.GetAllUser;
using eLonca.Application.Queries.UserQueries.GetUserById;
using MediatR;
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
        [HttpPost]
        public async Task<IActionResult> GetAll(GetAllUserQueryResponse getAllUserQueryResponse)
        {
            var response=await _mediator.Send(getAllUserQueryResponse);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult>GetById(GetUserByIdQueryResponse getUserByIdResponse)
        {
            var response = await _mediator.Send(getUserByIdResponse);
            return Ok(response);
        }
        [HttpPost]
        public async Task<IActionResult> Update(UserUpdateCommand command)
        {
            var response = await _mediator.Send(command);
            return Ok(response);
        }

    }
}
