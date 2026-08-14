using ArrayOperation;
using Dasboards;
using Displays;

namespace ArrayClasss
{
    class ArrayClass
    {
        Display display=new Display();
        ArrayOp arrayop=new ArrayOp();
        public ArrayClass()
        {
            while (true)
            {
                display.showArray();
                display.choice();
                int choice=int.Parse(Console.ReadLine()!);
                switch (choice)
                {
                    case 1:
                        arrayop.oneDimansalArray();
                        break;
                    case 2:
                        arrayop.twoDimansalArray();
                        break;
                    case 3:
                    arrayop.jackedArray();
                        break;
                    case 4:
                        return;
                    default:
                        Console.WriteLine("Please Choose Correct Choice...!");
                        break;
                }
            }
        }
    }
}