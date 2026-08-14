namespace Displays
{
    public class Display
    {
        public void showDasporad()
        {
            Console.WriteLine("--------------------------------------------------------------");
            Console.WriteLine("1.Arrays Types");
            Console.WriteLine("2.Strings");
            Console.WriteLine("3.Exit");
            Console.WriteLine("--------------------------------------------------------------");
        }
        public void showArray()
        {
            Console.WriteLine("--------------------------------------------------------------");
            Console.WriteLine("1.1D Array");
            Console.WriteLine("2.2D Array");
            Console.WriteLine("3.Jacked Array");
            Console.WriteLine("4.Back");
            Console.WriteLine("--------------------------------------------------------------");
        }
        public void showString()
        {
            Console.WriteLine("--------------------------------------------------------------");
            Console.WriteLine("1.String");
            Console.WriteLine("2.StringBuilder");
            Console.WriteLine("3.Back");
            Console.WriteLine("--------------------------------------------------------------");
        }
        public void choice()
        {
            Console.WriteLine();
            Console.Write("Enter Your Choice: ");
        }
    }
}