using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using EfsolTestTaskCSharp.Models;
using EfsolTestTaskCSharp.Data;

namespace EfsolTestTaskCSharp.Controllers
{
    public class HomeController : Controller
    {
        private readonly IQuestionsRepo _repository;

        public HomeController(IQuestionsRepo repository)
        {
            _repository = repository;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        [Route("questions")]
        public ActionResult<IEnumerable<Question>> GetAllQuestions()
        {
            var AllQuestions = _repository.GetAllQuestions();
            return Ok(AllQuestions);
        }

        [HttpGet("ById")]
        public ActionResult<Question> GetQuestionByID(int Id)
        {
            Question question = _repository.GetQuestionById(Id);
            return Ok(question);
        }

        [HttpGet("NextById")]
        [Route("nextquestion")]
        public ActionResult<Question> GetNextQuestionByCurrent(int Id)
        {
            Question question = _repository.GetNextQuestionByCurrent(Id);
            return Ok(question);
        }

        [HttpGet("PrevById")]
        [Route("nextquestion")]
        public ActionResult<Question> GetPreviousQuestionByCurrent(int Id)
        {
            Question question = _repository.GetPreviousQuestionByCurrent(Id);
            return Ok(question);
        }

        //[ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        //public IActionResult Error()
        //{
        //    return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        //}
    }
}