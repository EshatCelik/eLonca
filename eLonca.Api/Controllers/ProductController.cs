using eLonca.Application.Commands.ProductCommands.ProductCreate;
using eLonca.Application.Commands.ProductCommands.ProductDelete;
using eLonca.Application.Commands.ProductCommands.ProductUpdate;
using eLonca.Application.Queries.ProductQueries.GetAllProduct;
using eLonca.Application.Queries.ProductQueries.GetProductById;
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
        [HttpPost]
        public async Task<IActionResult> Update(ProductUpdateCommand productUpdateCommand)
        {
            var response = await _mediator.Send(productUpdateCommand);
            return Ok(response);
        }
        [HttpPost]
        public async Task<IActionResult>GetAll(GetAllProductQueryResponse getAllProductCommand)
        {
            var response = await _mediator.Send(getAllProductCommand);
            return Ok(response);
        }
        [HttpPost]
        public async Task<IActionResult> GetById(GetProductByIdQueryResponse getAllProductCommand)
        {
            var response = await _mediator.Send(getAllProductCommand);
            return Ok(response);
        }
        [HttpPost]
        public async Task<IActionResult> Delete(DeleteProducCommand  deleteProducCommand)
        {
            var response = await _mediator.Send(deleteProducCommand);
            return Ok(response);
        }
    }
}
