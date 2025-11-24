using eLonca.Application.Commands.SaleCommand.SaleCreate;
using MediatR; 
using Microsoft.AspNetCore.Mvc;

namespace eLonca.Api.Controllers
{
    public class SaleController : BaseController
    {
        private readonly IMediator _mediator;

        public SaleController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost]
        public async Task<IActionResult> Create(SaleCreateCommand saleCreateCommand)
        {
            var response = await _mediator.Send(saleCreateCommand);
            return Ok(response);
        }
    }
}
