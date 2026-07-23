let buttonClick=document.getElementById("btn");


let ul=document.getElementById("ul");


buttonClick.addEventListener("click",()=>{
    var val=document.getElementById("todolistinput").value;
    let button=document.createElement("button");
    let li=document.createElement("li");
    let br=document.createElement("br");
    if(val==="")return;
    li.innerHTML=val;
    button.innerHTML="Remove";
    ul.append(li);
    ul.append(button);
    // ul.append(br);
    li.classList.add("li");
    button.classList.add("button");
    button.addEventListener("click",()=>{
    li.remove();
    button.remove();
    // br.remove()
})
})
