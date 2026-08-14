using System;
using Displays;
using ArrayClasss;
using Stringclasss;

namespace Dasboards
{
    public class Dasboard
    {
       Display display=new Display();
        public Dasboard()
        {
            while (true)
            {
                display.showDasporad();
                display.choice();
                 int choice=int.Parse(Console.ReadLine()!);
                switch (choice)
                {
                    case 1:
                        display.showArray();
                        new ArrayClass();
                        break;
                    case 2:
                        display.showString();
                        new Stringclass();
                        break;
                    case 3:
                        Console.WriteLine("Thanks....!");
                        return;
                    default:
                        Console.WriteLine("Please Choose....!");
                        break;
                }
            }
           

        }
    }
}