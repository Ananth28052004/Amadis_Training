//callback function

function add(a2222,c){
    console.log(a2222);
    c()
}
function d(){
    console.log("success")
}
add(10,d);


//constructor function

function Student(name,age,rollno){
    this.name=name;
    this.age=age;
    this.rollno=rollno;
}
let s1=new Student("Ananth",22,22669);
let s2=new Student("Aathil Ali",21,904);

console.log(s1.name+" "+s2.name);

//nested function

function first(){
    console.log("First Function");
    function second(){
        console.log("Second Function")
    }
    second();
}
first();

//recursion function
function factorial(n){
    if(n<=1)return n;
    return n*factorial(n-1);
}
console.log(factorial(4));