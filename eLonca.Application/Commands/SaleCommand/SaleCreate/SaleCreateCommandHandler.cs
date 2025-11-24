using eLonca.Common.Models;
using eLonca.Domain.Entities;
using eLonca.Domain.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace eLonca.Application.Commands.SaleCommand.SaleCreate
{
    public class SaleCreateCommandHandler : IRequestHandler<SaleCreateCommand, Result<Sale>>
    {
        private readonly ISaleRepository _saleRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IProductRepository _productRepository;

        public SaleCreateCommandHandler(ISaleRepository saleRepository, IUnitOfWork unitOfWork, IProductRepository productRepository)
        {
            _saleRepository = saleRepository;
            _unitOfWork = unitOfWork;
            _productRepository = productRepository;
        }

        public async Task<Result<Sale>> Handle(SaleCreateCommand request, CancellationToken cancellationToken)
        {
            try
            {

                var checkStock = _productRepository.CheckProductStock(request.SaleItems);
                if (!checkStock.Result.IsSuccess)
                {
                    return Result<Sale>.Failure(new List<string>() { checkStock.Result.Message }, checkStock.Result.Message, 400);
                }
                var itemResponse = _saleRepository.GetItemsTotalAmount(request.SaleItems, request.CustomerId ?? Guid.Empty);
                if (!itemResponse.Result.IsSuccess)
                    return Result<Sale>.Failure(new List<string>() { itemResponse.Result.Message }, "Fiyatları hesaplarken hata alındı", 400);

                var totalAmount = itemResponse.Result.Data.ToList().Sum(x => x.TotalPrice);

                var sale = new Sale()
                {
                    SaleDate = DateTime.Now,
                    StoreId = request.StoreId,
                    CustomerId = request.CustomerId,
                    InvoiceNumber = request.InvoiceNumber,
                    Notes = request.Notes,
                    TotalAmount = totalAmount,
                    SaleItems = request.SaleItems,
                    PaidAmount = request.SaleItems.Sum(x => x.UnitPrice * x.Quantity),
                    PaymentType = request.PaymentType,
                    PaymentStatus = request.PaymentStatus
                };

                var response = _saleRepository.CreateAsync(sale, cancellationToken);
                var stockMovementResponse = _productRepository.UpdateProductStock(request.SaleItems, sale);

                return response.Result;
            }
            catch (Exception ex)
            {
                _unitOfWork.RollbackTransactionAsync();
                return Result<Sale>.Failure(null, ex.Message, 400);
            }
        }
    }
}
