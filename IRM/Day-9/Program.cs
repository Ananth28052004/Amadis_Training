
namespace Ananth
{
    class Ananth

    {
        public static void Main(String[] java)
        {
            String path=@"C:\Students";
            // if (Directory.Exists(path))
            // {
            //     Console.WriteLine("Directory is already exists");

            // }
            // else
            // {
            //     DirectoryInfo info= Directory.CreateDirectory(path);

            //     Console.WriteLine("Directory Created"+info);
            // }
            // // Directory.Delete(path,true);
            //    Directory.CreateDirectory(path+@"\Mani");
            // Directory.CreateDirectory(path+@"\Sri");
            // String[] file=Directory.GetFiles(path);
            // foreach(String d in file)Console.WriteLine(d);
            

            String pathfile=@"C:\Students\ananth.txt";
            // if (File.Exists(pathfile))
            // {
            //     Console.WriteLine("File is Alredy Exists");
            // }
            // else
            // {
            //     Console.WriteLine("File Created");
            //     File.Create(pathfile);
            // }
            // // File.Delete(pathfile);
            // using StreamWriter write=new StreamWriter(pathfile,true);
            // write.WriteLine("Hello");
            // write.WriteLine("Ananth");

            using StreamReader reader=new StreamReader(pathfile);

        //  Console.WriteLine(reader.ReadToEnd());
        // String line=reader.ReadLine();
            // while (line != null)
            // {
            //     Console.WriteLine(line);
            //     line=reader.ReadLine();
            // }
            int val=reader.Read();
            while (val!=-1)
            {
                Console.WriteLine((char)(val));
                val=reader.Read();
            }
        }
    }
}