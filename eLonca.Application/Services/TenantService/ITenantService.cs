using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace eLonca.Application.Services.TenantService
{
    public interface ITenantService
    {
        Guid GetTenantId();   
    }
}
