class Dasboard
{
    Display display =new Display();
    ShowStudent showStudent=new ShowStudent();
    AddStudent addStudent=new AddStudent();
    public Dasboard(){
        while (true)
        {
            display.displayMain();
            int choice=int.Parse(Console.ReadLine()!);
            switch (choice)
            {
                case 1:
                    showStudent.showStudent();
                    break;
                case 2:
                    addStudent.addStudent();
                    break;
                case 5:
                    Console.WriteLine("Thank You");
                    return;
                default:
                    Console.WriteLine("Please Enter Correct value..!");
                    break;
            }

        }
    }
}