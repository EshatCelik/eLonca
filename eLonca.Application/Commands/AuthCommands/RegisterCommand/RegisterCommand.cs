using eLonca.Common.Models;
using eLonca.Domain.Entities;
using MediatR;

namespace eLonca.Application.Commands.AuthCommands.RegisterCommand
{
    public class RegisterCommand:IRequest<Result<RegisterResponse>>
    {
        public string TenantName { get; set; }
        public string Subdomain { get; set; }
        public string ConnectionString { get; set; }
        public int Status { get; set; }
        public int TenantPlan { get; set; }
        public DateTime? SubscriptionEndDate { get; set; }
        public int MaxUser { get; set; }
        public int MaxStores { get; set; }
        public string LogoUrl { get; set; }
        public string TenantEmail { get; set; }
        public string TenantPhone { get; set; }

        public string? UserEmail { get; set; }
        public string? UserPhone { get; set; }
        public string UserFirsName { get; set; }
        public string UserLastName { get; set; }
        public string UserName { get; set; }
        public string PhoneNumber { get; set; }
        public string Password { get; set; }
        public string PasswordConfirm { get; set; } 
        public UserRole? UserRole { get; set; } 

        public string StoreName { get; set; }
        public string StoreAddress { get; set; }
        public string StorePhone { get; set; }
        public string StoreEmail { get; set; }
        public string StoreTaxNumber { get; set; }
        public string StoreLogoUrl { get; set; }
    }
}
