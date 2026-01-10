using eLonca.Common.DTOs.Role;
using eLonca.Common.Models;
using MediatR;

namespace eLonca.Application.Queries.RoleQueries.GetAllRolePermissionCategory
{
    public class GetAllRolePermissionCategoryQueryHandler : IRequestHandler<GetAllRolePermissionCategoryQueryResponse, Result<List<GetAllRolePermissionCategoryDto>>>
    {
        public async Task<Result<List<GetAllRolePermissionCategoryDto>>> Handle(GetAllRolePermissionCategoryQueryResponse request, CancellationToken cancellationToken)
        {
            var list = new List<GetAllRolePermissionCategoryDto>(){

                new GetAllRolePermissionCategoryDto(){Name="Mağaza",Id=Guid.NewGuid()},
                new GetAllRolePermissionCategoryDto(){Name="Kullanıcı",Id=Guid.NewGuid()},
                new GetAllRolePermissionCategoryDto(){Name="Tenant",Id=Guid.NewGuid()},
                new GetAllRolePermissionCategoryDto(){Name="Ürün Firmaları",Id=Guid.NewGuid()},
                new GetAllRolePermissionCategoryDto(){Name="kategoriler",Id=Guid.NewGuid()},
            };

            return Result<List<GetAllRolePermissionCategoryDto>>.Success(list.ToList(), "Liste başarılı", 200);
        }
    }
}
