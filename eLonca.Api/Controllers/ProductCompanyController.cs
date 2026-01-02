using eLonca.Application.Commands.ProductCompanyCommands.CreateProductCompany;
using eLonca.Application.Commands.ProductCompanyCommands.DeleteProductCompany;
using eLonca.Application.Commands.ProductCompanyCommands.UpdateProductCompany;
using eLonca.Application.Queries.ProductCompanyQueries.GetAll;
using eLonca.Application.Queries.ProductCompanyQueries.GetByIdQuery;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace eLonca.Api.Controllers
{
    public class ProductCompanyController : BaseController
    {
        private readonly IMediator _mediator;

        public ProductCompanyController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost]
        public async Task<IActionResult>Create(CreateProductCompanyCommandResponse createProductCompanyCommandResponse)
        {
            var response= await _mediator.Send(createProductCompanyCommandResponse);
            return Ok(response);
        }
        [HttpPost]
        public async Task<IActionResult> Update(UpdateProductCompanyCommandResponse createProductCompanyCommandResponse)
        {
            var response = await _mediator.Send(createProductCompanyCommandResponse);
            return Ok(response);
        }
        [HttpPost]
        public async Task<IActionResult> GetAll(GetAllProductCompanyQueryResponse createProductCompanyCommandResponse)
        {
            var response = await _mediator.Send(createProductCompanyCommandResponse);
            return Ok(response);
        }
        [HttpPost]
        public async Task<IActionResult> GetById(GetByIdProductCompanyQueryResponse createProductCompanyCommandResponse)
        {
            var response = await _mediator.Send(createProductCompanyCommandResponse);
            return Ok(response);
        }
        [HttpPost]
        public async Task<IActionResult> Delete(DeleteProductCompanyCommandResponse createProductCompanyCommandResponse)
        {
            var response = await _mediator.Send(createProductCompanyCommandResponse);
            return Ok(response);
        }
    }
}
