using eLonca.Common;
using eLonca.Common.Models;
using eLonca.Domain.Entities;
using MediatR;

namespace eLonca.Application.Commands.SaleCommand.SaleCreate
{
    public class SaleCreateCommand:IRequest<Result<Sale>>
    {
        public Guid? StoreId { get; set; }
        public Guid? StoreCustomerId { get; set; }
        public Guid? TenantId { get; set; }
        public DateTime? SaleDate { get; set; } = DateTime.UtcNow;
        public string? InvoiceNumber { get; set; } = string.Empty;
        public decimal? TotalAmount { get; set; }
        public decimal? PaidAmount { get; set; }
        public decimal? RemainingAmount { get; set; }
        public PaymentType PaymentType { get; set; }
        public PaymentStatus PaymentStatus { get; set; }
        public string? Notes { get; set; }
        public List<SaleItem>? SaleItems { get; set; }
    }
}
