show tables;
--Create table
create table Ananth(Rollno int primary key,Name varchar(40),Age int,Mark int);
--Insert Data
insert into Ananth(Rollno,name,Age,mark) values(22669,'Ananth',22,78);
insert into Ananth(Rollno,name,Age,mark) values(22670,'Sri Rengan',21,91);
insert into Ananth(Rollno,name,Age,mark) values(22671,'Esakki Arumugam',22,99);
insert into Ananth(Rollno,name,Age,mark) values(22672,'Hari Krishnan',22,89);
insert into Ananth(Rollno,name,Age,mark) values(22673,'Manikandan',21,70);
insert into Ananth(Rollno,names,Age,mark) values(226733,'Vijay',22,100);
insert into Ananth(Rollno,name,Age,mark) values(22675,'Pon Malar',20,100),(22727,'Priya',20,88);
--Display all data
select * from Ananth;
-- Print data if name starts with p
select * from Ananth where name like 'P%';
--Print data if name like endwith n
select * from Ananth where name like '%n';
-- print data if name like contains i
select * from Ananth where name like '%i%';
-------------------------------------------------------------------------------

                     --Create View
create view showmark as select * from Ananth where mark>90;
select * from showmark;
drop view show

-------------------------------------------------------------------------------
alter table Ananth alter column name type varchar(100);
alter table Ananth rename column name to names
alter table Ananth add column village varchar(20);
alter table Ananth drop column village;
insert into Ananth values(12,'Siddarth',21,100);


delete from Ananth where rollno=21
alter table Ananth add column village varchar(30)
alter table Ananth drop column village;



create table d(id int ,name varchar(33))
insert into d values(1,'dd'),(2,'dddd');
select * from d;
delete from d where id=1;
truncate table d;
alter table Ananth drop column village

select * from Ananth where mark>80 and age>20;


create view sidd as select * from Ananth where mark>80 and age>20;

select * from sidd;


create function add(a int,b int)
returns int
LANGUAGE plpgsql
as
$$
begin
	return a+b;
end;
$$;
select add(10,20)