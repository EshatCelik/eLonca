using eLonca.Application.Commands.SaleCommand.SaleCreate;
using eLonca.Application.Queries.SalesQueries.GetAllSale;
using eLonca.Application.Queries.SalesQueries.GetSaleById;
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
        [HttpPost]
        public async Task<IActionResult>GetAll(GetAllSalesQueryResponse getAllSalesQueryResponse)
        {
            var response=await _mediator.Send(getAllSalesQueryResponse);
            return Ok(response);
        }
        [HttpPost]
        public async Task<IActionResult> GetById(GetSaleByIdResponse getSaleByIdResponse)
        {
            var response = await _mediator.Send(getSaleByIdResponse);
            return Ok(response);
        }
    }
}
