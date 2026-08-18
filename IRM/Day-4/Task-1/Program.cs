namespace Ananth
{
    class Ananth
    {
        public  static void Main(String[] ananth)
        {
            // List<int>list=new List<int>();
            // list.Add(01);
            // list.Add(20);
            // list.Add(90);
            // list.Add(100);
            // int[] arr={1,2,3,4,5,6,7,8,9};
            // List<int>list2=new List<int>([1,2,3,4]);
            // List<int>list3=new List<int>(arr);
            // Console.WriteLine(list2[2]);
            // Console.WriteLine();
            // list3.RemoveAt(4);
            // for(int i = 0; i < list3.Count(); i++)
            // {
            //     Console.Write(list3[i]+" ");
            // }
            // Console.WriteLine();
            // Console.WriteLine("Number Of Element: "+list.Count());
            // foreach(int x in list3)
            // {
            //     Console.WriteLine(x);
            // }


        



            // List<String>list=new List<String>();
            // list.Add("Ananth");
            // list.Add("Sri");
            // list.Add("Siddart");
            // list.Add("Farhan");
            // Console.WriteLine(String.Join(" ",list));
            // Dictionary<int,String>map=new Dictionary<int, string>();
            // map.Add(1,"Ananth");
            // map.Add(2,"Malar");
            // map.Add(3,"Sri Rengan");
            // map.Add(4,"Afra");
            // Console.WriteLine(map[1]);
            // Console.WriteLine(map.ContainsKey(30));
            // Console.WriteLine(map.TryGetValue(1,out String val));
            // map[100]="skk";
            // Console.WriteLine(map[100]);



           List<Demo>demo=new List<Demo>();
            demo.Add(new Demo(22,"Ananth"));
            demo.Add(new Demo(2,"Siddarth"));
            demo.Add(new Demo(22,"Sri"));
            var res=demo.Where(x=>x.age>20).Select(x=>x.name).OrderByDescending(x=>x);
            Console.WriteLine(String.Join(" ",res));
            var res1=demo.OrderBy(x=>x.name);
            // Console.WriteLine(res);
            // var sel=demo.Select(x=>x.age).OrderBy(x=>x);
            // foreach(var x in sel)Console.WriteLine(x);
            // foreach(var c in res1)Console.WriteLine(c.name);

            Demo d=new Demo(12,"d");
            int sum,sub,mul;
            int age=99;
            d.calculation(80,70,out sum,out sub,out mul);
            Console.WriteLine(sum+" "+sub+" "+mul);
            Console.WriteLine(age);
            d.changeAge(ref age);
            Console.WriteLine(age);
            double pi=3.14;
            d.read(in pi);
        }
    }
    class Demo
    {
        public int age;
        public String name;
       public Demo(int age,String name)
        {
            this.age=age;
            this.name=name;
        }
        public List<String> find(List<String> list)
        {
            HashSet<String>set=new HashSet<String>();
            foreach(String x in list)set.Add(x);
            var res=set.OrderBy(x=>x);
            return res.ToList();
        }
        public void calculation(int a,int b,out int sum,out int sub,out int mul)
        {
            sum=a+b;
            sub=a-b;
            mul=a*b;
        }
        public void changeAge(ref int age)
        {
            age=22;
        }
        public void read(in double pi)
        {
            Console.WriteLine(pi);
            
        }
    }

}