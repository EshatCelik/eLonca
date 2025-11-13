using eLonca.Application.Commands.Tenants.CreateTenant;
using eLonca.Application.Services.TenantService;
using eLonca.Domain.Interfaces;
using eLonca.Infrastructure.Persistence;
using eLonca.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

var connectionString = builder.Configuration.GetConnectionString("eLoncaDb");
builder.Services.AddDbContext<LoncaDbContext>(opt => opt.UseSqlServer(connectionString), ServiceLifetime.Scoped);

builder.Services.AddHttpContextAccessor();

builder.Services.AddMediatR(c => c.RegisterServicesFromAssemblies(typeof(Program).Assembly));
builder.Services.AddMediatR(c => c.RegisterServicesFromAssemblies(typeof(CreateTenantCommandHandler).Assembly));

builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
builder.Services.AddScoped<ITenantRepository, TenantRepository>();
builder.Services.AddScoped<ITenantService, TenantService>();


builder.Services.AddControllers(); 
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
