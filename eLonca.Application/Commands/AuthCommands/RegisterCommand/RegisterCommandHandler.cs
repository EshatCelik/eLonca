using eLonca.Common.Models;
using eLonca.Domain.Entities;
using eLonca.Domain.Interfaces;
using MediatR;

namespace eLonca.Application.Commands.AuthCommands.RegisterCommand
{
    public class RegisterCommandHandler : IRequestHandler<RegisterCommand, Result<RegisterResponse>>
    {
        private readonly ITenantRepository _tenantRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserRepository _userRepository;
        private readonly IStoreRepository _storeRepository;

        public RegisterCommandHandler(ITenantRepository tenantRepository, IUnitOfWork unitOfWork, IUserRepository userRepository, IStoreRepository storeRepository)
        {
            _tenantRepository = tenantRepository;
            _unitOfWork = unitOfWork;
            _userRepository = userRepository;
            _storeRepository = storeRepository;
        }

        public async Task<Result<RegisterResponse>> Handle(RegisterCommand request, CancellationToken cancellationToken)
        {
            var isExist = await _tenantRepository.IsExistTenantByName(request.TenantName, cancellationToken);
            if (!isExist.IsSuccess)
                return Result<RegisterResponse>.Failure(null, "Tenant Daha önce kaydedilmiş", 200);
            var tenant = new Tenant()
            {
                Id = Guid.NewGuid(),
                ConnectionString = request.ConnectionString,
                Status = (TenantStatus)request.Status,
                Subdomain = request.Subdomain,
                SubscriptionEndDate = request.SubscriptionEndDate,
                ContractEmail = request.TenantEmail,
                ContractPhone = request.TenantPhone,
                LogoUrl = request.LogoUrl,
                MaxStores = request.MaxStores,
                MaxUser = request.MaxUser,
                Name = request.TenantName,
                TenantPlan = (TenantPlan)request.TenantPlan,
                IsActive = true,

            };
            var tenantResult = await _tenantRepository.CreateTenant(tenant, cancellationToken);
            if (!tenantResult.IsSuccess)
            {
                return Result<RegisterResponse>.Failure(tenantResult.Errors, "Tenant kaydı başarısız", 400);
            }

            var store = new Store()
            {
                Id = Guid.NewGuid(),
                StoreName = request.StoreName,
                Address = request.StoreAddress,
                Phone = request.StorePhone,
                Email = request.StoreEmail,
                TaxNumber = request.StoreTaxNumber,
                LogoUrl = request.StoreLogoUrl,
                TenantId = tenant.Id,
            };
            var storeResult = await _storeRepository.CreateAsync(store, cancellationToken);
            if (!storeResult.IsSuccess)
            {
                return Result<RegisterResponse>.Failure(storeResult.Errors, "Mağaza Kaydı başarısız", 400);
            }
            var user = new User()
            {
                UserName = request.UserName,
                Email = request.UserEmail,
                Name = request.UserFirsName,
                LastName = request.UserLastName,
                UserRole = request.UserRole ?? UserRole.SuperAdmin,
                PhoneNumber = request.PhoneNumber,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                RefreshTokenExpiry = DateTime.Now.AddDays(7),
                IsActive = true,
                StoreId = store.Id,
                TenantId = tenant.Id
            };
            var userResult = await _userRepository.CreateAsync(user, cancellationToken);
            if (!userResult.IsSuccess)
            {
                return Result<RegisterResponse>.Failure(userResult.Errors, "Kullanıcı kaydı başarısız", 400);
            }

            await _unitOfWork.SaveChangeAsync(cancellationToken);
            var registerModel = new RegisterResponse()
            {
                IsSuccess = true,
                Tenant = tenantResult.Data,
                Store = storeResult.Data,
                User = userResult.Data
            };
            return Result<RegisterResponse>.Success(registerModel, " Üye kaydı başarılı", 200);
        }
    }
}
