using eLonca.Application.Commands.StoreCommands.StoreCreate;
using eLonca.Application.Queries.StoreQueries;
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
        public async Task<IActionResult> GetAll(GetAllStoreQueryResponse getAllStoreQueryResponse)
        {
            var result=await _mediator.Send(getAllStoreQueryResponse);
            return Ok(result);
        }
    }
}
