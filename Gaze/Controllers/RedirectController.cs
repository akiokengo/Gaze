using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace TypeScriptHTMLApp1.Controllers
{
    public class RedirectController : Controller
    {
        // GET: Redirect
        public ActionResult Index()
        {

            return Content("<html><script>window.top.location.href = \"https://www.google.com/search?igu=1\"; </script></html>");

            //return Redirect(@"~/webgazer.html");
            //return View();
        }
    }
}