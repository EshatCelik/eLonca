using eLonca.Application.Commands.CategoryCommands.CategoryCreate;
using eLonca.Application.Queries.CategoryQueries.GetAllCategory;
using eLonca.Application.Queries.CategoryQueries.GetUserById;
using eLonca.Application.Queries.StoreQueries.GetStoreById;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace eLonca.Api.Controllers
{

    public class CategoryController : BaseController
    {
        private readonly IMediator _mediator;

        public CategoryController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost]
        public async Task<IActionResult> Create (CategoryCreateCommand createCommand)
        {
            var response=await _mediator.Send(createCommand);
            return Ok(response);
        }
        [HttpPost]
        public async Task<IActionResult>GetAll(GetAllCategoryQueryResponse getAllCategoryQueryResponse)
        {
            var response=await _mediator.Send(getAllCategoryQueryResponse);
            return Ok(response);
        }
        [HttpPost]
        public async Task<IActionResult> GetById(GetCategoryByIdResponse getCategoryByIdResponse)
        {
            var response = await _mediator.Send(getCategoryByIdResponse);
            return Ok(response);
        }
    }
}
