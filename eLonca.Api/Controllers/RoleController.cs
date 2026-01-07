using eLonca.Application.Commands.RoleCommand.Command.RoleCreate;
using eLonca.Application.Commands.SaleCommand.SaleCreate;
using eLonca.Application.Commands.SaleCommand.SaleUpdate;
using eLonca.Application.Queries.RoleQueries.GetAllRole;
using eLonca.Application.Queries.SalesQueries.GetAllSale;
using eLonca.Application.Queries.SalesQueries.GetSaleById;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace eLonca.Api.Controllers
{
    public class RoleController : BaseController
    {
        private readonly IMediator _mediator;

        public RoleController(IMediator mediator)
        {
            _mediator = mediator;
        }
        [HttpPost]
        public async Task<IActionResult> Create(RoleCreateCommandResponse roleCreateCommandResponse)
        {
            var response = await _mediator.Send(roleCreateCommandResponse);
            return Ok(response);
        }
        [HttpPost]
        public async Task<IActionResult> GetAll(GetAllRoleQueryResponse getAllSalesQueryResponse)
        {
            var response = await _mediator.Send(getAllSalesQueryResponse);
            return Ok(response);
        }
        [HttpPost]
        public async Task<IActionResult> GetAllCustomerSale(GetAllSalesQueryResponse getAllSalesQueryResponse)
        {
            var response = await _mediator.Send(getAllSalesQueryResponse);
            return Ok(response);
        }
        [HttpPost]
        public async Task<IActionResult> GetById(GetSaleByIdResponse getSaleByIdResponse)
        {
            var response = await _mediator.Send(getSaleByIdResponse);
            return Ok(response);
        }
        [HttpPost]
        public async Task<IActionResult> Update(UpdateSaleResponse updateSaleResponse)
        {
            var response = await _mediator.Send(updateSaleResponse);
            return Ok(response);
        }
    }
}
