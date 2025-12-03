using eLonca.Common.Models;
using MediatR;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;

namespace eLonca.Api.Controllers
{
    [Route("api/[controller]/[action]")]
    [EnableCors("FrontendCors")]
    [ApiController]
    public class BaseController : ControllerBase
    {
        //private readonly IMediator _mediator;

        //public BaseController(IMediator mediator)
        //{
        //    _mediator = mediator;
        //}

        //[HttpPost]
        //public async Task<IActionResult> Create(T command)
        //{

        //    var response = await _mediator.Send(command);
        //    return Ok(response);
        //}

        //[HttpPost]
        //public async Task<IActionResult> Update(T command)
        //{

        //    var response = await _mediator.Send(command);
        //    return Ok(response);
        //}
        //[HttpPost]
        //public async Task<IActionResult> Delete(T command)
        //{

        //    var response = await _mediator.Send(command);
        //    return Ok(response);
        //}
        //[HttpPost]
        //public async Task<IActionResult> GetAll(T command)
        //{

        //    var response = await _mediator.Send(command);
        //    return Ok(response);
        //}
    }
}
