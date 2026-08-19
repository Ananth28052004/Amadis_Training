using System.Dynamic;

namespace Ananth
{
    class Ananth
    {
        public static void Main(String[] ananth)
        {
            List<Employee>empList=new List<Employee>();
            empList.Add(new Employee(1,"Ananth","Softwer Developer",68000.90));
            empList.Add(new Employee(2,"Esakki Arumugam","logistics",80000.34));
            empList.Add(new Employee(3,"Hari Krishnan","Developer",900000.23));
            empList.Add(new Employee(4,"Sri Rengan","Army",890000.90));
            Console.WriteLine("------------------------------------------------------------------");

            foreach(Employee e in empList)
            {
                Console.WriteLine("Employee Name:  "+e.getEmpName()+" employe Dept:  "+e.getDepartment()+" Salary:  "+e.getSalary());
            }
            var selectEmployeeName=empList.Select(x=>x.getEmpName());
            Console.WriteLine("------------------------------------------------------------------");
            foreach(String e in selectEmployeeName)
            {
                Console.WriteLine(e);
            }
            Console.WriteLine("------------------------------------------------------------------");
            var filterSalary=empList.Where(x=>x.getSalary()>80000);
            foreach(var s in filterSalary)
            {
                Console.WriteLine(s.getEmpName());
            }
            var sortSolary=empList.OrderByDescending(x=>x.getSalary());

            foreach(Employee e in sortSolary)
            {
                Console.WriteLine("Employee Name:  "+e.getEmpName()+" employe Dept:  "+e.getDepartment()+" Salary:  "+e.getSalary());
            }
            Employee k=new Employee(1,"Ananth","Softwer Developer",68000.90);
            k.temp="s";
            k.Designation="dddddd";
            k.Acc=90000000;
            Console.WriteLine(k.temp+" "+k.Designation+" "+k.Acc+" "+Employee.count);

            int a=10,b=0;
            try
            {
                int c=a/b;
            }
            catch(DivideByZeroException e)
            {
                Console.WriteLine(e.Message);
            }
            finally
            {
                try
                {
                    int[] arr={12,3};
                    int val=arr[9];
                }
                catch(Exception e)
                {
                    Console.WriteLine(e.Message);
                }
            }
            int age=12;
            try
            {
                if (age < 18)
                {
                    
                }
            }
            catch(Exception e)
            {
             Console.WriteLine(e.Message);   
            }
        }
    }
    class Employee
    {
       public static int count=0;
        private int emp_id;
        private String emp_name;
        private String department;
        private double salary;
        public Employee(int emp_id,String emp_name,String department,double salary)
        {
            this.emp_id=emp_id;
            this.emp_name=emp_name;
            this.department=department;
            this.salary=salary;
            count++;
        }
         // emp_id
    public int getEmpId()
    {
        return emp_id;
    }
    public void setEmpId(int value)
    {
        emp_id = value;
    }

    // emp_name
    public string getEmpName()
    {
        return emp_name;
    }
    public void setEmpName(string value)
    {
        emp_name = value;
    }

    // department
    public string getDepartment()
    {
        return department;
    }
    public void setDepartment(string value)
    {
        department = value;
    }

    // salary
    public double getSalary()
    {
        return salary;
    }
    public void setSalary(double value)
    {
        salary = value;
    }
    public String temp{get;set;}
    public string Designation { get ; set; }
    private int accno;
    public int Acc
        {
            get{return accno;}
            set{accno=value;}
        }

    }
}