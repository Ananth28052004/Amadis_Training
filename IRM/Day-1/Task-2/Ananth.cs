namespace A
{
    class First
    {
        static void Main(String[] args)
        {
            Console.WriteLine("I am Ananth");
            Malar m=new Malar();
            m.check(13);
        }
    }
}
class Malar
{
    public void check(int age){
    if (age >= 18) Console.WriteLine("You can vote");
    else Console.WriteLine("You cannot vote");
    }
}