using MySql.Data.MySqlClient;

public class DBConnection
{
    public static MySqlConnection getConnection()
    {
        String con="server=localhost;database=studentresultmanagment;user=root;password=Ananth@24;";
        return new MySqlConnection(con);
    }
}