using API.Helps;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{   
    [ServiceFilter(typeof(LogsUserActivity))]
    [Route("api/[controller]")]
    [ApiController]
    public class BaseApiController:ControllerBase
    {

    }
}