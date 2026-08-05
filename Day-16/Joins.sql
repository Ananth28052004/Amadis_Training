                                          --Joins
create table student(student_id int primary key,name varchar(40),dept_id int ,foreign key(dept_id) references department(dept_id))
create table department(dept_id int primary key,dept_name varchar(30));
INSERT INTO department (dept_id, dept_name) VALUES
(1, 'Computer Science'),
(2, 'Electronics and Communication'),
(3, 'Mechanical Engineering'),
(4, 'Civil Engineering'),
(5, 'Information Technology');
select * from department;
select * from student;
insert into department values(6,'Computer Application')
INSERT INTO student (student_id, name, dept_id) VALUES
(1, 'Arun Kumar', 1),
(2, 'Divya Sri', 2),
(3, 'Praveen Raj', 3),
(4, 'Kavya Lakshmi', 1),
(5, 'Suresh Babu', 4),
(6, 'Meena Priya', 5),
(7, 'Vignesh Waran', 2),
(8, 'Anitha Devi', 3),
(9, 'Karthik Raja', 1),
(10, 'Priya Dharshini', 4),
(11, 'Naveen Kumar', 5),
(12, 'Sowmya Ravi', 2),
(13, 'Sathish Kumar', 3),
(14, 'Deepika Rani', 1),
(15, 'Ramesh Chandran', 4),
(16, 'Nithya Shree', 5),
(17, 'Gokul Raj', 2),
(18, 'Aishwarya S', 3),
(19, 'Bala Murugan', 1),
(20, 'Swetha Menon', 4),
(21, 'Dinesh Kannan', 5),
(22, 'Revathi Suresh', 2),
(23, 'Manoj Kumar', 3),
(24, 'Lavanya Devi', 1),
(25, 'Senthil Kumar', 4),
(26, 'Pooja Iyer', 5),
(27, 'Ashok Prabhu', 2),
(28, 'Divya Bharathi', 3),
(29, 'Rajesh Kanna', 1),
(30, 'Sneha Priya', 4),
(31, 'Vijay Anand', 5),
(32, 'Keerthana R', 2),
(33, 'Muthu Kumar', 3),
(34, 'Harini Sundar', 1),
(35, 'Selvam Raj', 4),
(36, 'Nandhini K', 5),
(37, 'Sudhakar M', 2),
(38, 'Yamuna Devi', 3),
(39, 'Prakash Raj', 1),
(40, 'Gayathri S', 4);
insert into student values(41,'Pon Malar',5);
create table mark(student_id int primary key, mark int,foreign key(student_id) references student(student_id))
insert into mark values(50,90);
select * from mark;
INSERT INTO mark (student_id, mark) VALUES
(1, 78),
(2, 85),
(3, 62),
(4, 91),
(5, 47),
(6, 73),
(7, 88),
(8, 55),
(9, 67),
(10, 94),
(11, 39),
(12, 81),
(13, 72),
(14, 58),
(15, 90),
(16, 64),
(17, 77),
(18, 49),
(19, 83),
(20, 71),
(21, 95),
(22, 60),
(23, 86),
(24, 53),
(25, 79),
(26, 68),
(27, 92),
(28, 45),
(29, 75),
(30, 63),
(31, 87),
(32, 56),
(33, 80),
(34, 69),
(35, 97),
(36, 51),
(37, 74),
(38, 89),
(39, 42),
(40, 66);





INSERT INTO student (student_id, name, dept_id) VALUES
(46, 'Ramya Krishnan', NULL),
(42, 'Vinoth Kumar', NULL),
(43, 'Shalini Devi', NULL),
(44, 'Arjun Prasad', NULL),
(45, 'Kavitha Rani', NULL);
-----------------------------------------------------------------------------------------------------------------------

										--INNER JOIN

select s.student_id,s.name,d.dept_id,m.mark from student s 
 join department d on s.dept_id=d.dept_id
 join mark m on m.student_id=s.student_id;


 select s.student_id,s.name,m.mark from student s join mark m on s.student_id=m.student_id

 select s.name,d.dept_name from student s inner join department d on s.dept_id=d.dept_id where d.dept_name='Information Technology';

 -------------------------------------------------------------------------------------------------------------------
 										--LEFT JOIN
select s.name,d.dept_name from student s left join department d on s.dept_id=d.dept_id;
select count(*) as student_without_dept from student s left join department d on s.dept_id=d.dept_id where s.dept_id is null;
-----------------------------------------------------------------------------------------------------------------
										--RIGHT JOIN 
select s.student_id,s.name,d.dept_name from department as  d right join student as s on s.dept_id=d.dept_id

--------------------------------------------------------------------------------------------------------------
create table tabe1(name varchar(30));
create table table2(subject varchar(30),sub_id int primary key)
insert into tabe1 values('Afra')
insert into table2 values('Python',3)
select * from tabe1;
----------------------------------------------------------------------------------------------------------
										--CROSS JOIN
select t1.name,t2.subject from tabe1 t1 cross join table2 t2;
select * from tabe1 cross join table2 t2;
-----------------------------------------------------------------------------------------------------------------
										--FULL JOIN

select s.name,d.dept_name from student s full join department d on s.dept_id=d.dept_id


------------------------------------------------------------------------------------------------\
									--SELF JOIN

create table emp(id int primary key,name text,m_id int);
select * from emp
insert into emp values(4,'Athil',1);
select e.name as Employee ,m.name as Manager from emp e  join emp m on m.id=e.m_id 


select s.name,d.dept_name from student s natural join department d;  


----------------------------------------------------------------------------------------------
create table A(name text);
create table B(name text);
insert into a values('Esakki Arumugam')
select * from A;
select * from B;
------------------------------------------------------------------------------------------------------
								--SET OPERATOR

--UNION
select name from A
UNION
select name from B

--UNION ALL
select name from A
UNION ALL
select name from B

--INTERSECT
select name from A
INTERSECT
select name from B

--EXCEPT
select name from A
EXCEPT
select name from B
--------------------------------------------------------------------------------------------------------------------

create table emp1(id  serial primary key ,name text, dept_id int);
insert into emp1(name,dept_id) values('Ananth',1);
insert into emp1(name,dept_id) values('Annamalai',2);
insert into emp1(name,dept_id) values('Arun Albert',1);
insert into emp1(name,dept_id) values('Sri Rengan',5);

create table dep1(dep_id int primary key,dept_name text)
insert into  dep1 values(1,'JAVA')
insert into  dep1 values(4,'C++')
insert into  dep1 values(5,'PYTHON')
--------------------------------------------------------------------------------------------------------
								--SEMI LEFT JOIN
								
select * from emp1 e where  exists(select * from dep1 d where d.dep_id=e.dept_id);
select * from emp1 e where e.dept_id in(select dept_id from dep1)

------------------------------------------------------------------------------------------------------------------

								--LEFT ANTI JOIN

select * from emp1 e where not exists(select * from dep1 d where e.dept_id=d.dep_id)
select * from emp1 e where e.dept_id not in(select dept_id from dep1)