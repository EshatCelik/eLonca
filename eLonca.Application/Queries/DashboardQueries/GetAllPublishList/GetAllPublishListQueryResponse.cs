

using eLonca.Common.Models;
using eLonca.Domain.Entities;
using MediatR;

namespace eLonca.Application.Queries.DashboardQueries.GetAllPublishList
{
    public class GetAllPublishListQueryResponse :IRequest<Result<List<ProductList>>>
    {

    }
}
