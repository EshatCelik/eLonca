using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace eLonca.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : BaseController
    {
        private readonly IMediator _mediator;
        private readonly ITokenService _tokenService;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public AuthController(
            IMediator mediator,
            ITokenService tokenService,
            IHttpContextAccessor httpContextAccessor)
        {
            _mediator = mediator;
            _tokenService = tokenService;
            _httpContextAccessor = httpContextAccessor;
        }

        [HttpPost("Login")]
        public async Task<IActionResult> Login(LoginCommand loginCommand)
        {
            var response = await _mediator.Send(loginCommand);
            return Ok(response);
        }

        [HttpPost("LogOut")]
        public async Task<IActionResult> LogOut(LoginCommand loginCommand)
        {
            try
            {
                // 1. Current user'ı al (token'dan veya context'ten)
                var userId = GetCurrentUserId();
                var tenantId = GetCurrentTenantId();

                // 2. Token'ı invalidate et
                if (!string.IsNullOrEmpty(userId))
                {
                    await _tokenService.InvalidateTokenAsync(userId, tenantId);
                }

                // 3. Response'daki token'ı temizle
                Response.Headers.Remove("Authorization");
                
                // 4. Logout command'ı çalıştır (varsa)
                var logoutCommand = new LogoutCommand
                {
                    UserId = userId,
                    TenantId = tenantId,
                    LogoutTime = DateTime.UtcNow
                };

                await _mediator.Send(logoutCommand);

                return Ok(new { 
                    isSuccess = true, 
                    message = "Logout successful" 
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { 
                    isSuccess = false, 
                    message = ex.Message 
                });
            }
        }

        private string GetCurrentUserId()
        {
            // JWT token'dan userId'yi al
            var userIdClaim = User?.FindFirst("UserId")?.Value 
                            ?? User?.FindFirst("sub")?.Value 
                            ?? User?.FindFirst("nameid")?.Value;
            
            return userIdClaim;
        }

        private string GetCurrentTenantId()
        {
            // JWT token'dan tenantId'yi al
            var tenantIdClaim = User?.FindFirst("TenantId")?.Value 
                              ?? User?.FindFirst("tenant")?.Value;
            
            return tenantIdClaim;
        }
    }

    // Token Service Interface
    public interface ITokenService
    {
        Task InvalidateTokenAsync(string userId, string tenantId);
    }

    // Token Service Implementation
    public class TokenService : ITokenService
    {
        private readonly ICacheService _cacheService;
        private readonly ILogger<TokenService> _logger;

        public TokenService(ICacheService cacheService, ILogger<TokenService> logger)
        {
            _cacheService = cacheService;
            _logger = logger;
        }

        public async Task InvalidateTokenAsync(string userId, string tenantId)
        {
            try
            {
                // Cache'de token'ı invalidate et
                var cacheKey = $"user_token_{userId}_{tenantId}";
                await _cacheService.RemoveAsync(cacheKey);

                // Blacklist'e ekle (opsiyonel)
                var blacklistKey = $"blacklisted_token_{userId}_{tenantId}";
                await _cacheService.SetAsync(blacklistKey, true, TimeSpan.FromHours(24));

                _logger.LogInformation($"Token invalidated for user: {userId}, tenant: {tenantId}");
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error invalidating token: {ex.Message}");
                throw;
            }
        }
    }

    // Cache Service Interface
    public interface ICacheService
    {
        Task<T> GetAsync<T>(string key);
        Task SetAsync<T>(string key, T value, TimeSpan? expiry = null);
        Task RemoveAsync(string key);
    }

    // Logout Command
    public class LogoutCommand : IRequest<IActionResult>
    {
        public string UserId { get; set; }
        public string TenantId { get; set; }
        public DateTime LogoutTime { get; set; }
    }

    // Logout Command Handler
    public class LogoutCommandHandler : IRequestHandler<LogoutCommand, IActionResult>
    {
        private readonly IAuthRepository _authRepository;
        private readonly ILogger<LogoutCommandHandler> _logger;

        public LogoutCommandHandler(IAuthRepository authRepository, ILogger<LogoutCommandHandler> logger)
        {
            _authRepository = authRepository;
            _logger = logger;
        }

        public async Task<IActionResult> Handle(LogoutCommand request, CancellationToken cancellationToken)
        {
            try
            {
                // Database'de kullanıcı logout bilgisini kaydet
                await _authRepository.LogoutUserAsync(request.UserId, request.TenantId, request.LogoutTime);

                _logger.LogInformation($"User logged out: {request.UserId}, tenant: {request.TenantId}");

                return new OkObjectResult(new { isSuccess = true, message = "Logout recorded" });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Logout error: {ex.Message}");
                return new BadRequestObjectResult(new { isSuccess = false, message = ex.Message });
            }
        }
    }

    // Auth Repository Interface
    public interface IAuthRepository
    {
        Task LogoutUserAsync(string userId, string tenantId, DateTime logoutTime);
    }

    // Auth Repository Implementation
    public class AuthRepository : IAuthRepository
    {
        private readonly DbContext _context;
        private readonly ILogger<AuthRepository> _logger;

        public AuthRepository(DbContext context, ILogger<AuthRepository> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task LogoutUserAsync(string userId, string tenantId, DateTime logoutTime)
        {
            try
            {
                // UserSessions tablosunda logout kaydı oluştur
                var userSession = new UserSession
                {
                    UserId = userId,
                    TenantId = tenantId,
                    LogoutTime = logoutTime,
                    IsActive = false,
                    CreatedAt = DateTime.UtcNow
                };

                _context.UserSessions.Add(userSession);
                await _context.SaveChangesAsync();

                _logger.LogInformation($"User session logged out: {userId}");
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error logging out user session: {ex.Message}");
                throw;
            }
        }
    }

    // UserSession Entity
    public class UserSession
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public string TenantId { get; set; }
        public DateTime LoginTime { get; set; }
        public DateTime? LogoutTime { get; set; }
        public bool IsActive { get; set; }
        public string TokenHash { get; set; }
        public string IpAddress { get; set; }
        public string UserAgent { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
