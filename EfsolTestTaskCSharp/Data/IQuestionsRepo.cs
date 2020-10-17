using EfsolTestTaskCSharp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EfsolTestTaskCSharp.Data
{
    public interface IQuestionsRepo
    {
        bool SaveChanges();

        IEnumerable<Question> GetAllQuestions();

        Question GetQuestionById(int id);

        Question GetNextQuestionByCurrent(int CurID);

        Question GetPreviousQuestionByCurrent(int curID);

        void CreateResult(Question question);
    }
}