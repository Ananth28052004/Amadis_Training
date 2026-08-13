using System;

namespace MyApp{
    class Program{
        public static void Main(string[] args){
            int a = 10;
            int b = 11;
            Console.WriteLine("Add: " + add(a, b));
            Console.WriteLine("Sub: " + sub(90, 70));
            Console.WriteLine("Mul: " + mul(90, 2));
            Console.WriteLine("Div: " + divison(100, 10));

            int n = 5;
            for (int i = 0; i < n; i++){
                for (int j = 0; j <= i; j++){
                    Console.Write("* ");
                }
                Console.WriteLine();
            }
            //Console.Write("Enter Number: ");
            //int input=int.Parse(Console.ReadLine());
            //bool value = Convert.ToBoolean(Console.ReadLine());
            //Console.WriteLine("The Number is: "+input);

            //Password Checker
            Console.Write("Enter Password: ");
            String password = Console.ReadLine();
            passwordCheck(password);

        }

        static int add(int a, int b){
            return a + b;
        }

        static int sub(int a, int b){
            return a - b;
        }

        static int mul(int a, int b){
            return a * b;
        }

        static int divison(int a, int b){
            return a / b;
        }
        static void passwordCheck(String password)
        {
            if (password.Length < 8)
            {
                Console.WriteLine("Password Must more then 8 letter!!");
                return;
            }
            bool lower= false; 
            bool upper= false;
            bool digit= false; 
            bool special= false;
            int num = password.Length;
            for (int i = 0; i < num; i++){
                char ch = password[i];
                if (ch >= 'a' && ch <= 'z') lower = true;
                else if (ch >= 'A' && ch <= 'Z') upper = true;
                else if (ch >= '0' && ch <= '9') digit = true;
                else special = true;
            }
            if (!lower) Console.WriteLine("LowerCase Letter Missing");
            if(!upper) Console.WriteLine("UpperCase Letter Missing");
            if (!digit) Console.WriteLine("Digit Letter Missing");
            if (!special) Console.WriteLine("Special Letter Missing");
            if (lower && upper && digit && special) Console.WriteLine("Success");
        }
    }
}