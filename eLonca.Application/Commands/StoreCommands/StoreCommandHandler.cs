using eLonca.Common.Models;
using eLonca.Domain.Entities;
using eLonca.Domain.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace eLonca.Application.Commands.StoreCommands
{
    public class StoreCommandHandler : IRequestHandler<StoreCreateCommand, Result<Store>>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IStoreRepository _storeRepository;

        public StoreCommandHandler(IUnitOfWork unitOfWork, IStoreRepository storeRepository)
        {
            _unitOfWork = unitOfWork;
            _storeRepository = storeRepository;
        }

        public async Task<Result<Store>> Handle(StoreCreateCommand request, CancellationToken cancellationToken)
        {
            var store = new Store()
            {
                StoreName = request.StoreName,
                Address = request.Address,
                Phone = request.Phone,
                Email = request.Email,
                TaxNumber = request.TaxNumber,
                LogoUrl = request.LogoUrl,
            };
            var result = await _storeRepository.CreateAsync(store, cancellationToken);
            return result;
        }
    }
}
