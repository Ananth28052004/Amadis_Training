using MySql.Data.MySqlClient;
class ShowStudent
{
    public void showStudent()
    {
         MySqlConnection con=DBConnection.getConnection();
            String sql="select * from student";
            try
            {
            con.Open();
            MySqlCommand command=new MySqlCommand(sql,con);
            MySqlDataReader render=command.ExecuteReader();
            while (render.Read()){
                Console.WriteLine($"id: {render[0]} " + $"Name :{render[1]} " + $"Age :{render[2]}");
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