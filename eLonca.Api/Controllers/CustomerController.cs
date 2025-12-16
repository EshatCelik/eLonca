using eLonca.Application.Commands.CustomerCommands.CustomerCreate;
using eLonca.Application.Commands.CustomerCommands.CustomerDelete;
using eLonca.Application.Queries.CustomerQueries.GetAllCustomer;
using eLonca.Application.Queries.UserQueries.GetUserById;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace eLonca.Api.Controllers
{
    public class CustomerController : BaseController
    {
        private readonly IMediator _mediator;
        public CustomerController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost]
        public async Task<IActionResult> Create(CustomerCreateCommand customerCreateCommand)
        {
            var repsonse = await _mediator.Send(customerCreateCommand);
            return Ok(repsonse);
        }

        [HttpPost]
        public async Task<IActionResult> Update(CustomerUpdateCommand customerCreateCommand)
        {
            var repsonse = await _mediator.Send(customerCreateCommand);
            return Ok(repsonse);
        }
        [HttpPost]
        public async Task<IActionResult> Delete(CustomerDeleteCommand  customerDeleteCommand)
        {
            var repsonse = await _mediator.Send(customerDeleteCommand);
            return Ok(repsonse);
        }

        [HttpPost]
        public async Task<IActionResult> GetAll(GetAllCustomerQueryResponse getAllCustomerQueryResponse)
        {
            var response = await _mediator.Send(getAllCustomerQueryResponse);
            return Ok(response);
        }
        [HttpPost]
        public async Task<IActionResult> GetById(GetCustomerByIdQueryResponse  getCustomerByIdQueryResponse)
        {
            var response = await _mediator.Send(getCustomerByIdQueryResponse);
            return Ok(response);
        }
        //[HttpPost]
        //public async Task<IActionResult>SearchByName(GetCustomerByNameQueryResponse getCustomerByName)
        //{
        //    var response = await _mediator.Send(getCustomerByName);
        //    return Ok(response);
        //}
    }
}
