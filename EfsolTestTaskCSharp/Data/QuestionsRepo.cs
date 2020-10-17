using EfsolTestTaskCSharp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EfsolTestTaskCSharp.Data
{
    public class QuestionsRepo : IQuestionsRepo
    {
        private readonly BdContext _context;

        public QuestionsRepo(BdContext context)
        {
            _context = context;
        }

        public void CreateResult(Question question)
        {
            if (question != null)
                _context.Questions.Add(question);
            else
                throw new ArgumentNullException();
        }

        public IEnumerable<Question> GetAllQuestions()
        {
            return _context.Questions.ToList().OrderBy(el => el.IdInQuery);
        }

        public Question GetNextQuestionByCurrent(int CurIdInQuery)
        {
            return _context.Questions.OrderBy(e => e.IdInQuery).FirstOrDefault(q => q.IdInQuery > CurIdInQuery);
        }

        public Question GetPreviousQuestionByCurrent(int CurIdInQuery)
        {
            return _context.Questions.OrderBy(e => e.IdInQuery).FirstOrDefault(q => q.IdInQuery < CurIdInQuery);
        }

        public Question GetQuestionById(int id)
        {
            return _context.Questions.FirstOrDefault(q => q.Id == id);
        }

        public bool SaveChanges()
        {
            return (_context.SaveChanges() >= 0);
        }
    }
}