using eLonca.Application.Commands.SaleItemCommand.CreateSaleItem;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace eLonca.Api.Controllers
{ 
    public class SaleItemController : BaseController
    {
        private readonly IMediator _mediator;

        public SaleItemController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost]
        public async Task<IActionResult>Create(AddSaleItemCommandResponse addSaleItemResponse)
        {
            var response= await _mediator.Send(addSaleItemResponse);
            return Ok(response);
        }
    }
}
