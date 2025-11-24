using eLonca.Application.Commands.ProductCommands;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace eLonca.Api.Controllers
{
    public class ProductController : BaseController
    {
        private readonly IMediator _mediator;

        public ProductController(IMediator mediator)
        {
            _mediator = mediator;
        }
        [HttpPost]
        public async Task<IActionResult> Create(ProductCreateCommand productCreateCommand)
        {
            var response = await _mediator.Send(productCreateCommand);
            return Ok(response);
        }
    }
}
