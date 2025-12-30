using eLonca.Application.Queries.DashboardQueries.GetAllPublishList;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace eLonca.Api.Controllers
{ 
    public class DashboardController : BaseController
    {
        private readonly IMediator mediator;

        public DashboardController(IMediator mediator)
        {
            this.mediator = mediator;
        }

        [HttpPost]
        public async Task<IActionResult> GetAllPublishList(GetAllPublishListQueryResponse getAllPublishListQueryResponse)
        {
            var response = await mediator.Send(getAllPublishListQueryResponse);
            return Ok(response);
        }
    }
}
