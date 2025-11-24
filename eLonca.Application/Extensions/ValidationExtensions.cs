using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.Extensions.DependencyInjection;
using System.Reflection;

namespace eLonca.Application.Extensions
{
    public static class ValidationExtensions
    {
        public static IServiceCollection AddApplicationValidations(this IServiceCollection services)
        {
            services.AddFluentValidationAutoValidation();
            services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly()); //tüm validatorleri bulur
            
            return services;
        }
    }
}
