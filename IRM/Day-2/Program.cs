namespace  Ananth
{
    class First
    {
        static void Main(String[] args)
        {
            If ifcontition=new If();
            Switch s=new Switch();
            ifcontition.eligibleForVote(20);
            ifcontition.rankCheck(89);
            Console.WriteLine(s.findDay(3));
            int age=19;
            String val=age>=18? "Eligble":"Not Elible";
            Console.WriteLine(val);
            age=1;
            switch (age)
            {
                case 1:
                    {
                        Console.WriteLine(val); 
                        break;
                    } 
                case 2: Console.WriteLine(val); break;
                case 3:break;
                default: Console.WriteLine(val);break;
                    
            }
        

        }
    }
}
class If
{
    public void eligibleForVote(int age)
    {
        if(age>=18)Console.WriteLine("Eligible for Vote...!");
        else Console.WriteLine("Not Elegible for vote");
    }
    public void rankCheck(int mark)
    {
        if(mark>=90)Console.WriteLine("A Gread");
        else if(mark<90 && mark>=80)Console.WriteLine("B Gread");
        else if(mark<80 && mark>=60)Console.WriteLine("C Gread");
        else Console.WriteLine("Fail");
    }
}
class Switch
{
    public String findDay(int day)
    {
        switch (day)
        {
            case 1:
            return "Sunday";
           
            case 2:
            return "Monday";
          
              case 3:
            return "Thusday";
            
              case 4:
            return "Wensday";
              case 5:
            return "Thusday";
            case 6:
            return "Friday";
              case 7:
            return "Satday";
            default :
            return "Enter Correct Days";

        }
    }
}