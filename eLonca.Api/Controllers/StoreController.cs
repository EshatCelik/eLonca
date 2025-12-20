using eLonca.Application.Commands.StoreCommands.StoreCreate;
using eLonca.Application.Commands.StoreCommands.StoreDelete;
using eLonca.Application.Queries.CustomerQueries.GetAllCustomerByName;
using eLonca.Application.Queries.StoreQueries.GetAllStore;
using eLonca.Application.Queries.StoreQueries.GetStoreById;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace eLonca.Api.Controllers
{
    //[Authorize]
    public class StoreController : BaseController
    {
        private readonly IMediator _mediator;

        public StoreController(IMediator mediator)
        {
            _mediator = mediator;
        }
        //[Authorize]
        [HttpPost]
        public async Task<IActionResult> Create(StoreCreateCommand command)
        {
            var result = await _mediator.Send(command);
            return Ok(result);
        }
        [HttpPost]
        public async Task<IActionResult> Delete(StoreDeleteCommand command)
        {
            var result = await _mediator.Send(command);
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> GetAll(GetAllStoreQueryResponse getAllStoreQueryResponse)
       {
            var result=await _mediator.Send(getAllStoreQueryResponse);
            return Ok(result);
        }
        [HttpPost]
        public async Task<IActionResult>GetById(GetStoreByIdQueryResponse getStoreByIdQueryResponse)
        {
            var response = await _mediator.Send(getStoreByIdQueryResponse);
            return Ok(response);
        }
        [HttpPost]
        public async Task<IActionResult> GetAllStoreByName(GetAllStoreByNameQueryResponse getAllStoreQueryResponse)
        {
            var result = await _mediator.Send(getAllStoreQueryResponse);
            return Ok(result);
        }
    }
}
