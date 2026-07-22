var click=document.getElementsByClassName("clickbtn");
var doubleClick=document.getElementById("dlbtn");
var mouseover=document.querySelector(".mouseover");
var mouseleave=document.getElementsByClassName("mouseleave")[0];
var mouseup=document.getElementsByClassName("mouseup")[0];
var mousedown=document.getElementsByClassName("mousedown")[0];
click[0].addEventListener("click",()=>{
    document.getElementsByClassName("clickh1")[0].style.display="block";
})
click[1].addEventListener("click",()=>{
    document.getElementsByClassName("clickh1")[0].style.display="none";
})

doubleClick.addEventListener("dblclick",()=>{
    document.getElementById("dlh3").innerHTML="";   
})
mouseover.addEventListener("mouseover",()=>{
    mouseover.style.backgroundColor="red";
})
mouseleave.addEventListener("mouseleave",()=>{
    mouseleave.style.backgroundColor="red";
})
mouseup.addEventListener("mouseup",()=>{
    mouseup.style.backgroundColor="red";
})
mousedown.addEventListener("mousedown",()=>{
    mousedown.style.backgroundColor="red";
})