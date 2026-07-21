let student={
    name:"Ananth",
    age:22,
    rollno:22669
}
for(var c in student){
    console.log(c+" "+student[c]);
}
console.log(Object.values(student))//show values
console.log(Object.keys(student))//show keys
student.skill="java";//add object element
console.log(student);

