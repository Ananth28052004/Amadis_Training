using Displays;
using StringOpertions;

namespace Stringclasss
{
    class Stringclass
    {
        Display display=new Display();
        StringOpertion op=new StringOpertion();
        public Stringclass()
        {
            while (true)
            {
                display.showString();
                display.choice();
                int choice=int.Parse(Console.ReadLine()!);
                switch (choice)
                {
                    case 1:
                        op.addString();
                        break;
                    case 2:
                    op.addStringBuilder();
                        break;
                    case 3:
                        return;
                    default:
                        Console.WriteLine("Thanks...!");
                        return;
                }
            }
        }
    }
}