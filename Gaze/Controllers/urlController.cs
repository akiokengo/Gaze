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

            if (q.StartsWith("https://www.youtube.com/watch"))
            {
                var enc = HttpUtility.UrlDecode(q);
                var url = new Uri(enc);
                var queryString = HttpUtility.ParseQueryString(url.Query);
                var id = queryString["v"];
                // 自前のサイトに飛ばす
                return Redirect($"play.html?v={id}");
            }

            return Redirect(q);
        }
    }
}