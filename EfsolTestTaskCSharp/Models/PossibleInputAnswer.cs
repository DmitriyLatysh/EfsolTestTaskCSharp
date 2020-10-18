using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EfsolTestTaskCSharp.Models
{
    public class PossibleInputAnswer
    {
        public int Id { get; set; }
        public int idQuestion { get; set; }
        public string PossibleInput { get; set; }
    }
}