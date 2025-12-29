
 
using eLonca.Application.Commands.ProductCommands.ProductDelete;
using eLonca.Application.Commands.ProductCommands.ProductUpdate;
using eLonca.Application.Commands.ProductListCommand.ProductListCreateCommand; 
using eLonca.Application.Queries.ProductListQueries.GetAllProductList; 
using eLonca.Application.Queries.ProductQueries.GetProductById;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace eLonca.Api.Controllers
{
    public class ProductListController : BaseController
    {

        private readonly IMediator _mediator;

        public ProductListController(IMediator mediator)
        {
            _mediator = mediator;
        }
        [HttpPost]
        public async Task<IActionResult> Create(CreateProductListCommandResponse productCreateCommand)
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
        public async Task<IActionResult> GetAll(GetAllProductListQueryResponse getAllProductCommand)
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
        public async Task<IActionResult> Delete(DeleteProducCommand deleteProducCommand)
        {
            var response = await _mediator.Send(deleteProducCommand);
            return Ok(response);
        }
    }
}
