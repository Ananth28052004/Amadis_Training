let a=document.getElementById("tagh1")
console.log(a.getAttribute("style") )
let changebtn=document.getElementsByClassName("change")[0];
changebtn.addEventListener("click",()=>{
    document.getElementById("img").setAttribute("src","Marvel.jfif");
    document.getElementById("img").setAttribute("class","imgclass")
})

let placeholder=document.getElementById("input");
let placeholderbtn=document.querySelector("#inputbtn");
placeholderbtn.addEventListener("click",()=>{
    placeholder.removeAttribute("placeholder");
})


let hqtag=document.getElementsByClassName("qq")[0];
console.log(hqtag.hasAttribute("id"));