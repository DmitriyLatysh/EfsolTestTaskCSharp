using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EfsolTestTaskCSharp.Models
{
    public class Question
    {
        public int Id { get; set; }
        public string TextQuestion { get; set; }
        public int IdInQuery { get; set; }

        public string AnswerType { get; set; }
    }
}