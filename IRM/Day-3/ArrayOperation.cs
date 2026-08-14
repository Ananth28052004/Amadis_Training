namespace ArrayOperation
{
    class ArrayOp
    {
        public void oneDimansalArray()
        {
            Console.Write("Enter Array Size: ");
            int size=int.Parse(Console.ReadLine()!);
            Console.WriteLine();
            int[] arr=new int[size];
            for(int i = 0; i < size; i++)
            {
                Console.Write($"Enter {i+1} St Value: ");
                arr[i]=int.Parse(Console.ReadLine()!);
            }
            Console.WriteLine();
            Console.Write("[ ");
            for(int i = 0; i < size; i++)
            {
                if(i==size-1)Console.Write(arr[i]);
                else Console.Write(arr[i]+", ");
            }
            Console.Write(" ]");
            Console.WriteLine();
            return;
        }
        public void twoDimansalArray()
        {
            Console.Write("Enter Row: ");
            int row=int.Parse(Console.ReadLine()!);
            Console.WriteLine();
            Console.Write("Enter Column: ");
            int column=int.Parse(Console.ReadLine()!);
            int[,] matrix=new int[row,column];
            for(int i = 0; i < row; i++)
            {
                for(int j = 0; j < column; j++)
                {
                    Console.Write($"Enter {i+1} St Row {j+1} st Column :");
                    matrix[i,j]=int.Parse(Console.ReadLine()!);
                    Console.WriteLine();
                }
            }
            int m=matrix.GetLength(0),n=matrix.GetLength(1);
           for(int i = 0; i < m;i++)
            {
                Console.Write("[ ");
                for(int j = 0; j < n; j++)
                {
                    if(j==n-1)Console.Write(matrix[i,j]);
                    else Console.Write(matrix[i,j]+",");
                }
                Console.Write(" ]");
                Console.WriteLine();
            }
            Console.WriteLine();
            return;
        }
        public void jackedArray()
        {
            Console.Write("Enter Row Size: ");
            int row=int.Parse(Console.ReadLine()!);
            int[][] arr=new int[row][];
            Console.WriteLine();
            for(int i = 0; i < row; i++)
            {
                Console.Write($"Enter {i+1} row in Column: ");
                int column=int.Parse(Console.ReadLine()!);
                int[] temp=new int[column];
                for(int j = 0; j < column; j++)
                {
                    Console.Write($"Enter {i+1} st row {j+1} th Column: ");
                    temp[j]=int.Parse(Console.ReadLine()!);
                    Console.WriteLine();
                }
                arr[i]=temp;
            }
            Console.WriteLine();
            for(int i = 0; i < arr.Length;i++)
            {
                Console.Write("[");
                for(int j = 0; j < arr[i].Length;j++)
                {
                    if(arr[i].Length-1==j)Console.Write(arr[i][j]);
                    else Console.Write(arr[i][j]+",");
                }
                Console.Write("]");
                Console.WriteLine();
            }
        }
        
    }
}