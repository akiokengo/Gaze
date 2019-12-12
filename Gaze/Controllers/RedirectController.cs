using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace TypeScriptHTMLApp1.Controllers
{
    public class RedirectController : Controller
    {
        static readonly HttpClient _client = new HttpClient();

        public async Task<ActionResult> Index()
        {
            var query = Request.QueryString["q"];
            var uri = "https://gazefunctions.azurewebsites.net/search?q=" + query;

            var html = await GetAsync(uri);
            return Content(html);
        }

        protected async Task<string> GetAsync(string uri)
        {
            try
            {
                HttpResponseMessage response = await _client.GetAsync(uri);
                response.EnsureSuccessStatusCode();
                return await response.Content.ReadAsStringAsync();
            }
            catch (Exception ex)
            {
                Trace.TraceError(ex.ToString());
                throw;
            }

        }

    }
}