using AngleSharp;
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
    public class GoogleSearchRequest
    {
        public string Query { get; set; }
    }

    public class GoogleController : Controller
    {
        // GET: Google
        public ActionResult Search()
        {
            var query = Request.QueryString["q"];
            query = query.Replace(" ", "+");
            //var uri = $"https://www.google.com/search?q={query}";
            var uri = "https://en.wikipedia.org/wiki/List_of_The_Big_Bang_Theory_episodes";


            var dom = Get(uri);

            return new JsonResult()
            {
                Data = new { Dom = dom }
            };
        }

        protected string Get(string uri)
        {
            return GetAsync(uri).Result;
        }

        protected async Task<string> GetAsync(string uri)
        {
            HttpClient client = new HttpClient();
            HttpResponseMessage response = await client.GetAsync(uri);
            string responseText = await response.Content.ReadAsStringAsync();
            return responseText;
        }

        //protected async Task<string> GetAsync(string uri)
        //{
        //    try
        //    {
        //        var config = Configuration.Default.WithDefaultLoader();
        //        var context = BrowsingContext.New(/* config */);
        //        var document = await context.OpenAsync(uri);
        //        return document.ToHtml();
        //    }
        //    catch (Exception ex)
        //    {
        //        Trace.TraceError(ex.ToString());
        //        throw;
        //    }
        //}



        //protected T ParseRequest<T>()
        //{
        //    if (Request == null) return default(T);
        //    var result = default(T);
        //    try
        //    {
        //        var bytes = ReadFully(Request.InputStream);
        //        result = Utf8Json.JsonSerializer.Deserialize<T>(bytes);
        //    }
        //    catch (Exception ex)
        //    {
        //        Trace.TraceError(ex.ToString());
        //    }
        //    return result;
        //}
        //public static byte[] ReadFully(Stream input)
        //{
        //    byte[] buffer = new byte[16 * 1024];
        //    using (var ms = new MemoryStream())
        //    {
        //        int read;
        //        while ((read = input.Read(buffer, 0, buffer.Length)) > 0)
        //        {
        //            ms.Write(buffer, 0, read);
        //        }
        //        return ms.ToArray();
        //    }
        //}
    }
}