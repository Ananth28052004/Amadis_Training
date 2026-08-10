CREATE TABLE Customers (
    customer_id SERIAL PRIMARY KEY,
    customer_name VARCHAR(100),
    city VARCHAR(50),
    phone VARCHAR(15)
);
INSERT INTO Customers(customer_name, city, phone)
VALUES('Ananth','Chennai','9876543210'),('Rahul','Delhi','9876543211'),
('Priya','Bangalore','9876543212'),('Karthik','Madurai','9876543213'),
('Meena','Coimbatore','9876543214'),('Vijay','Hyderabad','9876543215'),('Suresh','Pune','9876543216'),
('Arun','Mumbai','9876543217'),('Divya','Salem','9876543218'),
('Ramesh','Trichy','9876543219'),('John','Kochi','9876543220'),
('Akash','Goa','9876543221');

select * from customers;

CREATE TABLE Branches (
    branch_id SERIAL PRIMARY KEY,
    branch_name VARCHAR(50),
    city VARCHAR(50)
);

INSERT INTO Branches(branch_name,city)
VALUES
('Tenkasi Main','Tenkasi'),
('Alangulam Main','Thirunelveli'),
('Chennai Main','Chennai');

select * from Branches;


CREATE TABLE Accounts (
    account_id SERIAL PRIMARY KEY,
    customer_id INT not null,
    branch_id INT not null,
    account_type VARCHAR(20),
    balance DECIMAL(12,2),
	foreign key(customer_id) references Customers(customer_id),
	foreign key(branch_id) references  Branches(branch_id)
);
------------------------------------------------------------------------------------------------------------------------
select c.customer_name,b.branch_name,a.balance from customers c join Accounts a on c.customer_id=a.customer_id
join Branches b on b.branch_id=a.branch_id;
--------------------------------------------------------------------------------------------------------------------------

INSERT INTO Accounts(customer_id,branch_id,account_type,balance)
VALUES
(1,1,'Savings',85000),(2,2,'Savings',25000),
(3,3,'Current',120000),(4,1,'Savings',5000),
(5,2,'Savings',75000),(6,3,'Current',95000),
(7,1,'Savings',18000),(8,2,'Savings',62000),
(9,3,'Savings',48000),(10,1,'Current',200000),
(11,2,'Savings',32000),(12,3,'Savings',98000);

select * from Accounts;


CREATE TABLE Transactions (
    transaction_id SERIAL PRIMARY KEY,
    account_id INT,
    transaction_type VARCHAR(20),
    amount DECIMAL(10,2),
    transaction_date DATE,
	foreign key(account_id) REFERENCES Accounts(account_id)
);

INSERT INTO Transactions(account_id,transaction_type,amount,transaction_date)
VALUES
(1,'Deposit',10000,'2025-05-01'),
(1,'Withdrawal',5000,'2025-05-10'),
(2,'Deposit',7000,'2025-02-01'),
(3,'Deposit',25000,'2025-06-15'),
(3,'Withdrawal',10000,'2025-06-18'),
(5,'Deposit',30000,'2025-04-01'),
(6,'Withdrawal',15000,'2025-06-20'),
(8,'Deposit',12000,'2025-06-22'),
(10,'Deposit',50000,'2025-06-25'),
(10,'Withdrawal',8000,'2025-06-28');

select * from Transactions;
--------------------------------------------------------------------------------------------------------------------
select c.customer_name,b.branch_name,a.balance,t.transaction_type,t.amount from customers c join Accounts a on c.customer_id=a.customer_id
join Branches b on b.branch_id=a.branch_id join Transactions t on t.account_id=a.account_id;
----------------------------------------------------------------------------------------------------------------------

CREATE TABLE Loans (
    loan_id SERIAL PRIMARY KEY,
    customer_id INT,
    loan_type VARCHAR(30),
    amount DECIMAL(12,2),
    status VARCHAR(20),
	foreign key(customer_id) REFERENCES Customers(customer_id)
);


INSERT INTO Loans(customer_id,loan_type,amount,status)
VALUES
(1,'Home Loan',2500000,'Active'),
(1,'Car Loan',500000,'Active'),
(2,'Education Loan',400000,'Closed'),
(3,'Personal Loan',200000,'Active'),
(4,'Car Loan',350000,'Active'),
(5,'Home Loan',3000000,'Closed'),
(6,'Gold Loan',150000,'Active'),
(6,'Personal Loan',250000,'Active'),
(8,'Education Loan',450000,'Active');

select * from loans;
-------------------------------------------------------------------------------------------------------------------
select c.customer_name,b.branch_name,a.balance,t.transaction_type,t.amount,l.amount as loan_amound from customers c join Accounts a on c.customer_id=a.customer_id
join Branches b on b.branch_id=a.branch_id join Transactions t on t.account_id=a.account_id join loans l on l.customer_id=c.customer_id;
----------------------------------------------------------------------------------------------------------------------------------


CREATE TABLE Cards (
    card_id SERIAL PRIMARY KEY,
    customer_id INT,
    card_type VARCHAR(20),
    card_status VARCHAR(20),
	foreign key(customer_id)  REFERENCES Customers(customer_id)
);
INSERT INTO Cards(customer_id,card_type,card_status)
VALUES
(1,'Credit','Active'),
(2,'Debit','Active'),
(3,'Credit','Blocked'),
(4,'Debit','Active'),
(5,'Credit','Expired'),
(6,'Debit','Active'),
(7,'Credit','Active'),
(8,'Debit','Blocked'),
(9,'Credit','Active'),
(10,'Credit','Active');

select * from cards;

-------------------------------------------------------------------------------------------------------------------
select c.customer_name,b.branch_name,a.balance,t.transaction_type,t.amount,l.amount as loan_amound ,ca.card_type  from customers c join Accounts a on c.customer_id=a.customer_id
join Branches b on b.branch_id=a.branch_id join Transactions t on t.account_id=a.account_id join loans l on l.customer_id=c.customer_id join cards ca on ca.customer_id=c.customer_id;
----------------------------------------------------------------------------------------------------------------------------------
--1)

		--------------------------------------------------------------------------
		select c.customer_id,c.customer_name,a.balance from customers c join Accounts a on c.customer_id=a.customer_id
		 order by a.balance desc limit 10;


--2)

      -----------------------------------------------------------------------------


SELECT a.account_id,c.customer_name FROM Accounts a JOIN Customers c ON a.customer_id=c.customer_id
LEFT JOIN Transactions t ON a.account_id=t.account_id AND t.transaction_date >= CURRENT_DATE - INTERVAL '90 days'
WHERE t.transaction_id IS NULL;

	  -----------------------------------------------------------------------------

--3)

       -----------------------------------------------------------------------------
	  SELECT b.branch_name,DATE_TRUNC('month',t.transaction_date) AS month,
    SUM(
        CASE
            WHEN transaction_type='Deposit'
            THEN amount
            ELSE 0
        END
    ) AS total_deposit,
    SUM(
        CASE
            WHEN transaction_type='Withdrawal'
            THEN amount
            ELSE 0
        END
    ) AS total_withdrawal
FROM Transactions t JOIN Accounts a ON t.account_id=a.account_id JOIN Branches b ON a.branch_id=b.branch_id
GROUP BY b.branch_name,DATE_TRUNC('month',t.transaction_date)
ORDER BY month,branch_name;


--4)
     ------------------------------------------------------------------------
SELECT c.customer_id,c.customer_name,COUNT(l.loan_id) AS active_loans FROM Customers c
JOIN Loans l ON c.customer_id=l.customer_id WHERE l.status='Active'
GROUP BY c.customer_id,c.customer_name
HAVING COUNT(l.loan_id)>1;
		 
