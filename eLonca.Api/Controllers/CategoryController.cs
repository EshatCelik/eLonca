using eLonca.Application.Commands.CategoryCommands.CategoryCreate;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace eLonca.Api.Controllers
{

    public class CategoryController : BaseController
    {
        private readonly IMediator _mediator;

        public CategoryController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost]
        public async Task<IActionResult> Create (CategoryCreateCommand createCommand)
        {
            var response=await _mediator.Send(createCommand);
            return Ok(response);
        }
    }
}
