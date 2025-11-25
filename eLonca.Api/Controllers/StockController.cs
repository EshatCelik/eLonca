using eLonca.Application.Commands.StockCommands.StockCreate;
using eLonca.Application.Commands.StockCommands.StockDelete;
using eLonca.Application.Commands.StockCommands.StockUpdate;
using eLonca.Application.Queries.StockQueries.GetAllStockQuery;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace eLonca.Api.Controllers
{
    public class StockController : BaseController
    {
        private readonly IMediator _mediator;
        public StockController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost]
        public async Task<IActionResult>Create(StockCreateCommand stockCreateCommand)
        {
            var response= await _mediator.Send(stockCreateCommand);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> Update(StockUpdateCommand stockUpdateCommand)
        {
            var response = await _mediator.Send(stockUpdateCommand);
            return Ok(response);
        }
        [HttpPost]
        public async Task<IActionResult> Delete(StockDeleteCommand stockDeleteCommand)
        {
            var response = await _mediator.Send(stockDeleteCommand);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult>GetAll(GetAllStockQuery getAllStockQuery)
        {
            var response= await _mediator.Send(getAllStockQuery);
            return Ok(response);
        }
    }
}
