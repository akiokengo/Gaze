using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace TypeScriptHTMLApp1.Controllers
{
    public class urlController : Controller
    {
        // GET: url
        public ActionResult Index()
        {
            var q = this.Request.QueryString["q"];
            return Redirect(q);
        }
    }
}