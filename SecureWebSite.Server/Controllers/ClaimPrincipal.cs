using System.Security.Claims;

namespace SecureWebSite.Server.Controllers
{
    internal class ClaimPrincipal
    {
        private ClaimsPrincipal user_;

        public ClaimPrincipal(ClaimsPrincipal user_)
        {
            this.user_ = user_;
        }
    }
}