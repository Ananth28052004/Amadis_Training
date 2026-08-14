using System.Diagnostics;
using System.Text;

namespace StringOpertions
{
    class StringOpertion
    {
        public void addString()
        {
            // Console.Write("How Many Times Apped String: ");
            // int append=int.Parse(Console.ReadLine()!);
            String s="";
            // String[] temp=new string[append];
            //  for(int i = 0; i < append; i++)
            // {
            //     Console.Write($"Enter {i+1} time ppend Letter :");
            //     String t=Console.ReadLine()!;
            //     temp[i]=t;
            // }
            Stopwatch stopwatch=new Stopwatch();
            stopwatch.Start();
            for(int i = 0; i < 100000; i++)
            {
                s+=i;
            }
            stopwatch.Stop();
            Console.WriteLine("Total Time Taken :"+stopwatch.ElapsedMilliseconds+" ms");
        }
        public void addStringBuilder()
        {
            Stopwatch sw=new Stopwatch();
            StringBuilder sb=new StringBuilder();
            sw.Start();
            for(int i = 0; i < 1000000; i++)
            {
                sb.Append(i);
            }
            sw.Stop();
            Console.WriteLine("Total Time Taken: "+sw.ElapsedMilliseconds+" ms");
        }
    }
}