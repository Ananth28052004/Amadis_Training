    let add=document.getElementById("create");
    let show=document.getElementById("show");
    let clear=document.getElementById("clear");
    let clearAll=document.getElementById("clearall");
    let ans=document.getElementById("ans");

    add.addEventListener("click",()=>{
        
        let key=document.getElementById("key").value;
        let val=document.getElementById("value").value;
        console.log(key,val)
        let showans=document.getElementById("createans");
        if(key==="" || value==="")return;
        console.log(localStorage.getItem(key))
        if(localStorage.getItem(key)===null){
             localStorage.setItem(key,val);
            showans.innerHTML="Local Storage Stored";
        }
        else {
           showans.innerHTML="Alread this Key Add pleace add another key";
            return;
        }
    })
    show.addEventListener("click",()=>{
        let lenShow=localStorage.length;
        var showAns=document.getElementById("showans");
        var showtag;
        if(lenShow==0){
            showAns.innerHTML="No Local Storage";
            return;
        }
        else{
            for(let i=0;i<lenShow;i++){
                let key=localStorage.key(i);
                let val=localStorage.getItem(key);
                showtag+=`<tr><td>Key: ${key}</td><td>Value: ${val}</td></tr><br>`
            }
            showAns.innerHTML=`<table>${showtag}</table>`
        }
    })
    clear.addEventListener("click",()=>{
        let val=localStorage.getItem("Name");
        localStorage.removeItem("Name");
        ans.innerHTML=`${val}  Name is Removed`
    })
    clearAll.addEventListener("click",()=>{
        localStorage.clear();
        ans.innerHTML="All Storage Cleared"
    })