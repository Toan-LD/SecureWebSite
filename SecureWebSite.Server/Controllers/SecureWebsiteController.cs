using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SecureWebSite.Server.Models;
using System.Security.Claims;

namespace SecureWebSite.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SecureWebsiteController(SignInManager<User> sm, UserManager<User> um) : ControllerBase
    {
        private readonly SignInManager<User> signInManager = sm;
        private readonly UserManager<User> userManager = um;

        [HttpPost("register")]
        public async Task<ActionResult> RegisterUser(User user)
        {
            IdentityResult result = new();

            try
            {
                User user_ = new User()
                {
                    Name = user.Name,
                    Email = user.Email,
                    UserName = user.UserName
                };

                result = await userManager.CreateAsync(user_, user.PasswordHash);

                if (!result.Succeeded)
                {
                    return BadRequest(result);
                }
            }
            catch (Exception ex)
            {
                return BadRequest("Something went wrong, please try again " + ex.Message);
            }

            return Ok(new { message = "Registered Successfully", result = result });
        }

        [HttpPost("login")]
        public async Task<ActionResult> LoginUser(Login login)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                User user_ = await userManager.FindByEmailAsync(login.Email);
                if (user_ == null)
                {
                    return BadRequest(new { message = "Please check your credentials and try again" });
                }

                if (!await userManager.CheckPasswordAsync(user_, login.Password))
                {
                    return Unauthorized(new { message = "Invalid password" });
                }

                if (!user_.EmailConfirmed)
                {
                    user_.EmailConfirmed = true;
                }

                var result = await signInManager.PasswordSignInAsync(user_.UserName, login.Password, login.Remember, false);

                if (!result.Succeeded)
                {
                    return Unauthorized(new { message = "Check your login credentials and try again" });
                }

                user_.LastLogin = DateTime.Now;
                var updateResult = await userManager.UpdateAsync(user_);

                return Ok(new { message = "Login successful" });
            }
            catch (Exception ex)
            {
                return BadRequest("Something went wrong, please try again " + ex.Message);
            }
        }

        [HttpGet("logout"), Authorize]
        public async Task<ActionResult> LogoutUser()
        {
            try
            {
                await signInManager.SignOutAsync();
            }
            catch (Exception ex)
            {
                return BadRequest("Something went wrong, please try again " + ex.Message);
            }
            return Ok(new { message = "You are free to go!" });
        }

        [HttpGet("admin"), Authorize]
        public ActionResult AdminPage()
        {
            string[] partners = { "ToanLD", "Loan Duc Te", "Ahaha", "Ahihi" };

            return Ok(new { trustedPartners = partners });
        }

        [HttpGet("home/{email}"), Authorize]
        public async Task<ActionResult> HomePage(string email)
        {
            User userInfo = await userManager.FindByEmailAsync(email);
            if (userInfo == null)
            {
                return BadRequest(new {message = "Something went wrong, please try again!"});
            }

            return Ok(new {userInfo = userInfo});
        }

        [HttpGet("xhtlekd")]
        public async Task<ActionResult> CheckUser(string email)
        {
            string message = "";
            User currentUser = new();

            try
            {
                var user_ = HttpContext.User;
                var principal = new ClaimsPrincipal(user_);
                var result = signInManager.IsSignedIn(principal);

                if(result)
                {
                    currentUser = await signInManager.UserManager.GetUserAsync(principal);
                } else {
                    return Forbid("Access denied");
                }
            }
            catch (Exception ex)
            {
                return BadRequest(new {message= "Something went wrong, please try again! " + ex.Message });
            }

            return Ok(new { message = message, user = currentUser });
        }
    }
}
