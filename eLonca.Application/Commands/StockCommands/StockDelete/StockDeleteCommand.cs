using eLonca.Common.Models;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace eLonca.Application.Commands.StockCommands.StockDelete
{
    public class StockDeleteCommand:IRequest<Result>
    {
        public Guid StockId { get; set; }
    }
}
