using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace eLonca.Application.Commands.AuthCommands.RefreshTokenCommand
{
    public class RefreshTokenValidator:AbstractValidator<RefreshTokenCommand>
    {
        public RefreshTokenValidator()
        {
            RuleFor(x => x.RefreshToken).NotEmpty().WithMessage("refresh token boş olamaz");
            RuleFor(x => x.AccessToken).NotEmpty().WithMessage("access token boş olamaz");
        }
    }
}
