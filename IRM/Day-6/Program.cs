using System;

namespace Ananth
{
    interface IPayment
    {
        void Pay();
        void Refund();
        void Details();
    }
    abstract class Payment
    {
        protected int id;
        protected string name;
        protected double amount;
        public Payment(int id, string name, double amount)
        {
            this.id = id;
            this.name = name;
            this.amount = amount;
        }
        public abstract void Pay();

        public virtual void Print()
        {
            Console.WriteLine("Printing Payment");
        }
        public virtual void Refund()
        {
            Console.WriteLine("Refund Processing");
        }
        public void ShowName()
        {
            Console.WriteLine("Customer: " + name);
        }
        public void ShowId()
        {
            Console.WriteLine("Payment ID: " + id);
        }
        // Method Overloading
        public void Add()
        {
            Console.WriteLine("Payment Added");
        }
        public void Add(int amount)
        {
            Console.WriteLine("Amount: " + amount);
        }
        public void Add(int amount, string type)
        {
            Console.WriteLine("Amount: " + amount);
            Console.WriteLine("Type: " + type);
        }
    }
    class CardPayment : Payment, IPayment
    {
        private string card;
        private string bank;
        public CardPayment(
            int id,
            string name,
            double amount,
            string card,
            string bank) : base(id, name, amount)
        {
            this.card = card;
            this.bank = bank;
        }
        // Method Overriding
        public override void Pay()
        {
            Console.WriteLine("Card Payment");
            Console.WriteLine("Name: " + name);
            Console.WriteLine("Amount: " + amount);
            Console.WriteLine("Bank: " + bank);
            Console.WriteLine("Payment Successful");
        }
        public override void Print()
        {
            Console.WriteLine("Card Receipt Printed");
        }
        public override void Refund()
        {
            Console.WriteLine("Card Refund Successful");
        }
        // Interface implementation
        public void Details()
        {
            Console.WriteLine("Card Details");
            Console.WriteLine("ID: " + id);
            Console.WriteLine("Name: " + name);
            Console.WriteLine("Card: " + card);
        }
        // Method Overloading
        public void Pay(int amount)
        {
            Console.WriteLine("Card Amount: " + amount);
        }
        public void Pay(int amount, string type)
        {
            Console.WriteLine("Amount: " + amount);
            Console.WriteLine("Card Type: " + type);
        }
    }
    class UPIPayment : Payment, IPayment
    {
        private string upi;

        public UPIPayment(
            int id,
            string name,
            double amount,
            string upi) : base(id, name, amount)
        {
            this.upi = upi;
        }
        // Method Overriding
        public override void Pay()
        {
            Console.WriteLine("UPI Payment");
            Console.WriteLine("Name: " + name);
            Console.WriteLine("Amount: " + amount);
            Console.WriteLine("UPI: " + upi);
            Console.WriteLine("Payment Successful");
        }
        public override void Print()
        {
            Console.WriteLine("UPI Receipt Printed");
        }
        public override void Refund()
        {
            Console.WriteLine("UPI Refund Successful");
        }
        // Interface implementation
        public void Details()
        {
            Console.WriteLine("UPI Details");
            Console.WriteLine("ID: " + id);
            Console.WriteLine("Name: " + name);
            Console.WriteLine("UPI: " + upi);
        }
        // Method Overloading
        public void Pay(string upi)
        {
            Console.WriteLine("UPI ID: " + upi);
        }
    }
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("PAYMENT SYSTEM");
            Console.WriteLine("----------------");

            Payment p1 = new CardPayment(
                101,
                "Ananth",
                5000,
                "XXXX1234",
                "HDFC");

            p1.ShowId();
            p1.ShowName();
            p1.Pay();
            p1.Print();
            p1.Refund();

            Console.WriteLine();
            Console.WriteLine("OVERLOADING");

            p1.Add();
            p1.Add(5000);
            p1.Add(5000, "Card");

            Console.WriteLine();
            Console.WriteLine("UPI PAYMENT");

            Payment p2 = new UPIPayment(
                102,
                "Siddarth",
                2000,
                "siddarth@upi");

            p2.ShowId();
            p2.ShowName();
            p2.Pay();
            p2.Print();
            p2.Refund();

            Console.WriteLine();
            Console.WriteLine("INTERFACE");

            IPayment ip = new CardPayment(
                103,
                "Sri",
                3000,
                "XXXX5678",
                "SBI");

            ip.Pay();
            ip.Details();
            ip.Refund();

            Console.WriteLine();
            Console.WriteLine("POLYMORPHISM");

            Payment[] payments =
            {
                new CardPayment(
                    201,
                    "Ananth",
                    1000,
                    "XXXX1111",
                    "HDFC"),

                new UPIPayment(
                    202,
                    "Siddarth",
                    2000,
                    "siddarth@upi")
            };

            foreach (Payment payment in payments)
            {
                Console.WriteLine();
                payment.Pay();
                payment.Print();
            }

            Console.WriteLine();
            Console.WriteLine("PROGRAM COMPLETED");
            Console.ReadLine();
        }
    }
}