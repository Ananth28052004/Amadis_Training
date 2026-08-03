                         -- Constrains
-- 1)Not null
create table t1(id int primary key,name varchar(29), age int);
alter table t1 alter column name set not null;
insert into t1 values(22669,'Ananth',22),(22671,'Esakki Arumugam',22),(22782,'Sri Rengan',21),(22343,'Hari Krishnan',21),(24332,'Manikandan',22)
select * from t1;
      -- if I am not Add Name value Show error
	  -- insert into t1 (id,age) values(22321,22); this is error because name is null


-----------------------------------------------------------------------------------
-- 2) Unique
create table t2(emp_id int primary key,email varchar(30) unique);
create procedure add_emp(emp_id int,email varchar)
language plpgsql
as $$
begin
	insert into t2 values(emp_id,email);
end;
$$;
call add_emp(22,'asananth04@gmail.com');
call add_emp(543,'malar2507@gmail.com');
call add_emp(375,null)
      -- now this add throw error because this gmail alrey exists
call add_emp(344,'asananth04@gmail.com');
select * from t2;
-------------------------------------------------------------------------------
-- 3)Primary key
create table books(book_id int primary key,book_name  varchar(40) unique);
create procedure add_book(book_id int,book_name varchar)
language plpgsql
as $$
begin
	insert into books values(book_id,book_name);
end;
$$;
call add_book(2323,'java');
call add_book(893,'python');
call add_book(923,'HTML');
--now error because book must
call add_book(923,'CSS');
---------------------------------------------------------------------------------
-- 4)CHECK
create table age (id int primary key,name varchar(30),age int check(age>0));
create procedure add_age(id int,name varchar,age int)
language plpgsql
as $$
begin
	insert into age values(id,name,age);
end;
$$;
call add_age(233,'Ananth',22)
call add_age(65,'Pon Malar',19)
call add_age(232,'Aravinth',20)
call add_age(22,'Priya',22)
select * from age;
call add_age(233,'Ananth',-3)
-- now throw error because age not add - value

------------------------------------------------------------------------------------
--5)FOREIGN KEY

create table emp(emp_id int primary key,name varchar(30) not null);
create table emp_deatiles(emp_id int primary key,phone BIGINT,age int check (age>0),village varchar(30),foreign key(emp_id)references emp(emp_id) )
insert into emp values(1,'Ananth'),('2','Pon Malar'),(3,'Sri Rengan'),(4,'Afra');
select * from emp;
select * from emp_deatiles
insert into emp_deatiles values(1,9600493192,22,'Vadamalaiatty');
insert into emp_deatiles values(2,3455443454,20,'Agashthiyarpatti');
insert into emp_deatiles values(3,9645456662,22,'Pavoorchathiram');
insert into emp_deatiles values(4,9643233192,20,'Tenkasi');

-- not add because this key reference forgin key emp 
insert into emp_deatiles values(6,3445566666,22,'Vadamalaiatty');

select e.name,e1.age,e1.phone,e1.village from emp e join emp_deatiles e1 on e.emp_id=e1.emp_id

---------------------------------------------------------------------------------------------------
--6) DEFAULT

create table t5(name varchar(30) not null ,native varchar(23) default 'Chennai');
insert into t5 values('Ananth','Vdamalaipatty');
insert into t5 (name) values('Pon Malar');
select * from t5;

-- not enter city name default chennai add it
---------------------------------------------------------------------------------- 	
                          --Intex
create table student(id int,name varchar(50),city varchar(79))
create index ind on student(city)
drop index ind;
select * from student;
select * from student where city='Salem'
