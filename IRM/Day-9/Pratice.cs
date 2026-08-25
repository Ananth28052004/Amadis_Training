using System;
using System.IO;

class Program
{
    static void Main()
    {
        // =========================================================
        // 1. DIRECTORY
        // =========================================================

        string mainFolder = @"C:\CSharpFileHandling";
        string studentFolder = @"C:\CSharpFileHandling\Students";
        string logFolder = @"C:\CSharpFileHandling\Logs";

        Console.WriteLine("===== DIRECTORY OPERATIONS =====");

        // Directory.Exists()
        if (Directory.Exists(mainFolder))
        {
            Console.WriteLine("Main directory already exists.");
        }
        else
        {
            Directory.CreateDirectory(mainFolder);
            Console.WriteLine("Main directory created.");
        }

        // Directory.CreateDirectory()
        if (!Directory.Exists(studentFolder))
        {
            Directory.CreateDirectory(studentFolder);
            Console.WriteLine("Students directory created.");
        }

        if (!Directory.Exists(logFolder))
        {
            Directory.CreateDirectory(logFolder);
            Console.WriteLine("Logs directory created.");
        }


        // =========================================================
        // 2. FILE
        // =========================================================

        string studentFile =
            Path.Combine(studentFolder, "student.txt");

        string logFile =
            Path.Combine(logFolder, "application.log");

        Console.WriteLine();
        Console.WriteLine("===== FILE OPERATIONS =====");

        // File.Exists()
        if (File.Exists(studentFile))
        {
            Console.WriteLine("Student file already exists.");
        }
        else
        {
            // File.Create()
            File.Create(studentFile).Close();

            Console.WriteLine("Student file created.");
        }


        // =========================================================
        // 3. STREAMWRITER - WRITE TEXT
        // =========================================================

        Console.WriteLine();
        Console.WriteLine("===== STREAMWRITER =====");

        using (StreamWriter writer =
               new StreamWriter(studentFile, false))
        {
            // Write()
            writer.Write("Student Information");
            writer.WriteLine();

            // WriteLine()
            writer.WriteLine("--------------------");
            writer.WriteLine("Name: Ananth");
            writer.WriteLine("Course: BCA");
            writer.WriteLine("Language: C#");
            writer.WriteLine("Database: SQL");

            // Flush()
            writer.Flush();
        }

        Console.WriteLine("Student data written successfully.");


        // =========================================================
        // 4. APPEND DATA
        // =========================================================

        Console.WriteLine();
        Console.WriteLine("===== APPENDING DATA =====");

        using (StreamWriter writer =
               new StreamWriter(studentFile, true))
        {
            writer.WriteLine("Skill: Java");
            writer.WriteLine("Skill: MySQL");
            writer.WriteLine("Skill: File Handling");

            writer.Flush();
        }

        Console.WriteLine("Additional data appended.");


        // =========================================================
        // 5. STREAMREADER - READ ENTIRE FILE
        // =========================================================

        Console.WriteLine();
        Console.WriteLine("===== READTOEND() =====");

        using (StreamReader reader =
               new StreamReader(studentFile))
        {
            string content = reader.ReadToEnd();

            Console.WriteLine(content);
        }


        // =========================================================
        // 6. STREAMREADER - READ LINE BY LINE
        // =========================================================

        Console.WriteLine();
        Console.WriteLine("===== READLINE() =====");

        using (StreamReader reader =
               new StreamReader(studentFile))
        {
            string line;

            while ((line = reader.ReadLine()) != null)
            {
                Console.WriteLine(line);
            }
        }


        // =========================================================
        // 7. STREAMREADER - READ CHARACTER BY CHARACTER
        // =========================================================

        Console.WriteLine();
        Console.WriteLine("===== READ() =====");

        using (StreamReader reader =
               new StreamReader(studentFile))
        {
            int value;

            while ((value = reader.Read()) != -1)
            {
                char character = (char)value;

                Console.Write(character);
            }
        }

        Console.WriteLine();


        // =========================================================
        // 8. PEEK()
        // =========================================================

        Console.WriteLine();
        Console.WriteLine("===== PEEK() =====");

        using (StreamReader reader =
               new StreamReader(studentFile))
        {
            int value = reader.Peek();

            if (value != -1)
            {
                Console.WriteLine(
                    "Next character: " + (char)value);
            }

            Console.WriteLine(
                "Peek does not move the reader position.");

            // Now Read() reads the same character
            int readValue = reader.Read();

            Console.WriteLine(
                "Read character: " + (char)readValue);
        }


        // =========================================================
        // 9. GET FILES
        // =========================================================

        Console.WriteLine();
        Console.WriteLine("===== GETFILES() =====");

        string[] files =
            Directory.GetFiles(mainFolder, "*.*",
            SearchOption.AllDirectories);

        foreach (string file in files)
        {
            Console.WriteLine(file);
        }


        // =========================================================
        // 10. GET DIRECTORIES
        // =========================================================

        Console.WriteLine();
        Console.WriteLine("===== GETDIRECTORIES() =====");

        string[] directories =
            Directory.GetDirectories(mainFolder);

        foreach (string directory in directories)
        {
            Console.WriteLine(directory);
        }


        // =========================================================
        // 11. GET ONLY TXT FILES
        // =========================================================

        Console.WriteLine();
        Console.WriteLine("===== ONLY TXT FILES =====");

        string[] txtFiles =
            Directory.GetFiles(
                mainFolder,
                "*.txt",
                SearchOption.AllDirectories);

        foreach (string file in txtFiles)
        {
            Console.WriteLine(file);
        }


        // =========================================================
        // 12. LOG FILE
        // =========================================================

        Console.WriteLine();
        Console.WriteLine("===== LOG WRITING =====");

        using (StreamWriter writer =
               new StreamWriter(logFile, true))
        {
            writer.WriteLine(
                "Application started: " +
                DateTime.Now);

            writer.WriteLine(
                "Student file accessed: " +
                DateTime.Now);

            writer.WriteLine(
                "Application completed: " +
                DateTime.Now);

            writer.Flush();
        }

        Console.WriteLine("Log written successfully.");


        // =========================================================
        // 13. CHECK FILE EXISTS
        // =========================================================

        Console.WriteLine();
        Console.WriteLine("===== FILE EXISTENCE =====");

        if (File.Exists(studentFile))
        {
            Console.WriteLine(
                "student.txt exists.");
        }
        else
        {
            Console.WriteLine(
                "student.txt does not exist.");
        }


        // =========================================================
        // 14. OPTIONAL DELETE
        // =========================================================

        Console.WriteLine();
        Console.WriteLine("===== DELETE EXAMPLE =====");

        string temporaryFile =
            Path.Combine(
                studentFolder,
                "temporary.txt");

        if (!File.Exists(temporaryFile))
        {
            File.Create(temporaryFile).Close();

            Console.WriteLine(
                "Temporary file created.");
        }

        if (File.Exists(temporaryFile))
        {
            File.Delete(temporaryFile);

            Console.WriteLine(
                "Temporary file deleted.");
        }


        // =========================================================
        // END
        // =========================================================

        Console.WriteLine();
        Console.WriteLine(
            "===== PROGRAM COMPLETED =====");
    }
}