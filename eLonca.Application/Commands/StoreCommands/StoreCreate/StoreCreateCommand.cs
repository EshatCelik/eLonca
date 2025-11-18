using eLonca.Common.Models;
using eLonca.Domain.Entities;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace eLonca.Application.Commands.StoreCommands.StoreCreate
{
    public class StoreCreateCommand:IRequest<Result<Store>>
    {
        public string StoreName { get; set; }
        public string Address { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        public string TaxNumber { get; set; }
        public string LogoUrl { get; set; }
    }
}
