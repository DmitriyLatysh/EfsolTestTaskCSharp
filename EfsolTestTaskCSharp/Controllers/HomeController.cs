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
        private readonly BdContext _context;

        public HomeController(IQuestionsRepo repository, BdContext context)
        {
            _repository = repository;
            _context = context;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpGet("{id}")]
        [Route("getinputtypesbyid")]
        public ActionResult<IEnumerable<PossibleInputAnswer>> GetInputTypesById(int id)
        {
            return Ok(_context.PossibleInputAnswes.ToList().Where(e => e.idQuestion == id));
        }

        [HttpGet]
        [Route("questions")]
        public ActionResult<IEnumerable<Question>> GetAllQuestions()
        {
            var AllQuestions = _repository.GetAllQuestions();
            return Ok(AllQuestions);
        }

        [HttpPost]
        [Route("createanswer")]
        public ActionResult CreateUserProfile([FromBody] IEnumerable<Answer> result)
        {
            try
            {
                foreach (Answer eAnswer in result)
                _context.Answers.Add(eAnswer);

            _context.SaveChanges();

            return Ok(); //Created()
        }
            catch
            {
                return BadRequest();
    }
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
    }
}