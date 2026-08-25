using MySql.Data.MySqlClient;

class AddStudent
{
    public void addStudent()
    {
        MySqlConnection con=DBConnection.getConnection();
        String sql="insert into student values(?,?,?,?)";
        try{
            con.Open();
        MySqlCommand command=new MySqlCommand(sql,con);
        Console.WriteLine("Enter Rollno");
        int rollno=int.Parse(Console.ReadLine()!);
        Console.WriteLine("Enter Name: ");
        String name=Console.ReadLine();
        Console.WriteLine("Enter Age: ");
        int age=int.Parse(Console.ReadLine()!);
        Console.WriteLine("Enter Dept Id: ");
        int deptid=int.Parse(Console.ReadLine()!);
        command.Parameters.AddWithValue("1",rollno);
        command.Parameters.AddWithValue("2",name);
        command.Parameters.AddWithValue("3",age);
        command.Parameters.AddWithValue("4",deptid);
        int row=command.ExecuteNonQuery();
            if (row > 0)
            {
                Console.WriteLine("Student Add Successfully");
            }
            else
            {
              Console.WriteLine("Student Add Fail");
            }
        }
        catch(Exception e)
        {
            Console.WriteLine(e);
        }
        finally
        {
            con.Close();
        }

    }
}