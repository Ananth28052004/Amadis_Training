                    --Aggregate Functions && Group BY
create table emp(emp_id int primary key,name varchar(60) not null,dept varchar(40) not null,salary int check(salary>-1))
insert into emp values(101,'Ananth','HR',25000);
INSERT INTO emp (emp_id, name, dept, salary) VALUES
(1, 'Ananth', 'IT', 25000),
(2, 'Rahul', 'HR', 28000),
(3, 'Vijay', 'Finance', 30000),
(4, 'Priya', 'Sales', 27000),
(5, 'Kumar', 'Marketing', 32000),
(6, 'Arun', 'IT', 35000),
(7, 'Siva', 'HR', 29000),
(8, 'Ramesh', 'Finance', 33000),
(9, 'Mohan', 'Sales', 31000),
(10, 'Karthik', 'Marketing', 34000),
(11, 'Deepak', 'IT', 36000),
(12, 'Hari', 'HR', 37000),
(13, 'Ajith', 'Finance', 38000),
(14, 'Bala', 'Sales', 39000),
(15, 'Surya', 'Marketing', 40000),
(16, 'Ganesh', 'IT', 41000),
(17, 'Naveen', 'HR', 42000),
(18, 'Praveen', 'Finance', 43000),
(19, 'Lokesh', 'Sales', 44000),
(20, 'Dinesh', 'Marketing', 45000),
(21, 'Manoj', 'IT', 46000),
(22, 'Saravanan', 'HR', 47000),
(23, 'Vignesh', 'Finance', 48000),
(24, 'Santhosh', 'Sales', 49000),
(25, 'Aravind', 'Marketing', 50000),
(26, 'Nithin', 'IT', 51000),
(27, 'Sathish', 'HR', 52000),
(28, 'Vinoth', 'Finance', 53000),
(29, 'Kishore', 'Sales', 54000),
(30, 'Ashok', 'Marketing', 55000),
(31, 'Prakash', 'IT', 56000),
(32, 'Murugan', 'HR', 57000),
(33, 'Raj', 'Finance', 58000),
(34, 'Selvam', 'Sales', 59000),
(35, 'Gopi', 'Marketing', 60000),
(36, 'Suresh', 'IT', 61000),
(37, 'Ravi', 'HR', 62000),
(38, 'Senthil', 'Finance', 63000),
(39, 'Muthu', 'Sales', 64000),
(40, 'Bharath', 'Marketing', 65000),
(41, 'Kavin', 'IT', 66000),
(42, 'Yogesh', 'HR', 67000),
(43, 'Naren', 'Finance', 68000),
(44, 'Jagan', 'Sales', 69000),
(45, 'Arul', 'Marketing', 70000),
(46, 'Sakthi', 'IT', 71000),
(47, 'Vasanth', 'HR', 72000),
(48, 'Rohit', 'Finance', 73000),
(49, 'Madan', 'Sales', 74000),
(50, 'John', 'Marketing', 75000),
(51, 'Peter', 'IT', 76000),
(52, 'David', 'HR', 77000),
(53, 'Daniel', 'Finance', 78000),
(54, 'Sam', 'Sales', 79000),
(55, 'Joseph', 'Marketing', 80000),
(56, 'Alex', 'IT', 81000),
(57, 'Kevin', 'HR', 82000),
(58, 'Chris', 'Finance', 83000),
(59, 'Steve', 'Sales', 84000),
(60, 'Mark', 'Marketing', 85000),
(61, 'Paul', 'IT', 86000),
(62, 'George', 'HR', 87000),
(63, 'Henry', 'Finance', 88000),
(64, 'Jack', 'Sales', 89000),
(65, 'Thomas', 'Marketing', 90000),
(66, 'Robert', 'IT', 91000),
(67, 'William', 'HR', 92000),
(68, 'Richard', 'Finance', 93000),
(69, 'Charles', 'Sales', 94000),
(70, 'Edward', 'Marketing', 95000),
(71, 'Jason', 'IT', 96000),
(72, 'Victor', 'HR', 97000),
(73, 'Martin', 'Finance', 98000),
(74, 'Alan', 'Sales', 99000),
(75, 'Dennis', 'Marketing', 100000),
(76, 'Leo', 'IT', 101000),
(77, 'Nathan', 'HR', 102000),
(78, 'Oliver', 'Finance', 103000),
(79, 'Patrick', 'Sales', 104000),
(80, 'Ryan', 'Marketing', 105000),
(81, 'Sean', 'IT', 106000),
(82, 'Tony', 'HR', 107000),
(83, 'Victor', 'Finance', 108000),
(84, 'Wayne', 'Sales', 109000),
(85, 'Zack', 'Marketing', 110000),
(86, 'Akash', 'IT', 111000),
(87, 'Bharani', 'HR', 112000),
(88, 'Charan', 'Finance', 113000),
(89, 'Dharan', 'Sales', 114000),
(90, 'Eswar', 'Marketing', 115000),
(91, 'Farhan', 'IT', 116000),
(92, 'Gowtham', 'HR', 117000),
(93, 'Harish', 'Finance', 118000),
(94, 'Imran', 'Sales', 119000),
(95, 'Jeeva', 'Marketing', 120000),
(96, 'Kiran', 'IT', 121000),
(97, 'Logan', 'HR', 122000),
(98, 'Mani', 'Finance', 123000),
(99, 'Nanda', 'Sales', 124000),
(100, 'Omprakash', 'Marketing', 125000);
--1) count()
select count(*) as Total_Employee from emp;
select count(dept) as IT_EMPLOYES from emp where dept='IT';
select count(salary) as Salary_Morethen_70000 from emp where salary>=70000;
select dept,count(dept) as count_of_dept from emp  where salary>70000 group by dept;
--2) Sum()
select sum(salary) as Total_salary from emp;
select dept,sum(salary) as Total ,count(dept) as total_dept from emp group by dept;
select name,sum(salary) as total from emp where name like 'A%' group by name;
select dept,sum(salary),count(*) from emp group by dept;

--3)AVG()
select avg(salary) as Total_AVG from emp;
select dept,avg(salary) as average from emp group by dept;
select dept,count(salary) as total_dep,avg(salary)as average from emp group by dept;
select dept,count(salary) as total_dep,avg(salary)as average from emp  where salary>80000 group by dept;

--4)MAX()
select MAx(salary) as MAX_Salary from emp;
select dept,max(salary) as MAX_SALARY from emp group by dept;

--5)MIN()
select Min(salary) as min_Salary from emp;
select dept,min(salary) as MAX_SALARY from emp group by dept order by dept;
--------------------------------------------------------------------------------------
--String Function
select upper(name) from emp;
select lower(name) from emp;
select name,length(name) from emp;
select concat(NAME,' work in ',dept) from emp;
select name || ' Working ' || dept from emp;
-------------------------------------------------------------------------------------
select count(distinct salary) from emp;
select  count(*),dept from emp group by 2;
select dept,count(*) from emp group  by dept having count(dept)>20;
select name,salary, case when salary>90000 then 'Hige' when salary>80000 then 'medium' else 'low' end from emp
-----------------------------------------------------------------------------------------------

                                --Windows Function
select name,salary,avg(salary) over(partition by(salary) order by(name)) as total from emp;
select dept,salary,sum(salary) over(partition by dept order by salary) from emp;

--1)Row Number
select dept,salary,sum(salary) over(partition by dept),row_number() over(partition by dept order by salary) from emp;
select dept,row_number() over(partition by dept order by salary) from emp;

select dept,avg(salary) from emp group by dept having count(*)>20;
select dept,avg(salary) over(partition by dept) from emp;