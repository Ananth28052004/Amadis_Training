document.getElementById("clickid").addEventListener("click",()=>{
    let val=document.getElementById("nameid").value.trim();
    if(val==="")return;
    let ans=document.getElementById("ansid");
    ans.innerHTML=val+"  "+"id Selected"
})
document.getElementsByClassName("btnclass")[0].addEventListener("click",()=>{
    var numbers=document.getElementsByClassName("num");
    if(numbers[0].value==="" || numbers[1].value==="")return;
    var num1=Number(numbers[0].value.trim());
    var num2=Number(numbers[1].value.trim());
    numbers[2].innerHTML=num1+num2;
})
document.getElementsByClassName("tagname")[1].addEventListener("click",()=>{
    let val=document.getElementsByClassName("tagname");
    let tag=document.getElementsByTagName("h6");
    let lentag=tag.length;
    if(val[0].value==""){
        val[2].innerHTML="Please enter Selecting number";
        return;
    }
    let len=Number(val[0].value)-1
    if(lentag<=len){
        val[2].innerHTML="Length Large"
        return;
    }
    tag[len].innerHTML="Changing"
    val[2].innerHTML=""
})
document.querySelector(".btnquery").addEventListener("click",()=>{
    var age=document.querySelector("#age").value;
    var ans=document.querySelector("#ansq");
    if(age===""){
        ans.innerHTML="Please Enter Age"
        return;
    }
    age=Number(age);
    if(age<=0 || age>100){
        ans.innerHTML="age not lesss 0 and 100 more then";
        return;
    }
    if(age>=18){
        ans.innerHTML="You Are Eligable";
        return;
    }
    else ans.innerHTML="your Not Eligable"

})
document.querySelectorAll(".h1tag")[1].innerHTML="Changing"
