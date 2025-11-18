using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace eLonca.Infrastructure.Configuration
{
    public class JwtSettings
    {
        public const string SectionName = "Jwt";

        public string Key { get; set; }
        public string Issuer { get; set; }
        public string Audience { get; set; }
        public int ExpirationHours { get; set; }
        public int RefreshTokenExpirationDays { get; set; }
        public int ClockSkewMinutes { get; set; }
    }

}
