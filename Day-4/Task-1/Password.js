function nameValid(name){
        let fname=document.getElementById("fname").value;
        let ans1=document.getElementById("fnameop");
        if(fname=="")return false;
        if(fname.length>3){
            ans1.innerHTML="Verfied"
            ans1.style.color="green";
            checkLastName();
            return true;
        }
        else{
            ans1.innerHTML=name+" must above 4 letter required"
             ans1.style.color="red";
            return false;
        }
    }
    function checkLastName(){
        let lname=document.getElementById("lname").value;
        let ans=document.getElementById("lnameop");
        if(lname==""){
            ans.innerHTML="last name at lest 1 leeter required";
            ans.style.color="red";
            return false;
        }
        ans.innerHTML="Verfied";
        ans.style.color="green";
        checkUserName();
        return true;
    }
    function checkUserName(){
        var uname=document.getElementById("uname").value;
        let ans=document.getElementById("unameop");
        if(uname.length>=5){
            ans.innerHTML="Verfied";
            ans.style.color="green";
            return true;
        }
        else{
            ans.innerHTML="User name at lest 5 letter";
            ans.style.color="red";
            return false;
        }
    }
    function passwordCheck(){
        let password=document.getElementById("pass").value;
        let ans=document.getElementById("passop");
        var upper=false;
        var lower=false;
        var number=false;
        var specal=false;
        for(var i=0;i<password.length;i++){
            var ch=password[i];
            if(ch>='a' && ch<='z')lower=true;
            else if(ch>='A' && ch<='Z')upper=true;
            else if(ch>='0' && ch<='9')number=true;
            else specal=true;
        }
        ans.style.color="red";
        if(!upper){
            ans.innerHTML="at lest one uppercase letter";
            return;
        }
        if(!lower){
            ans.innerHTML="at lest one lowercase letter"
            return;
        }
        if(!number){
            ans.innerHTML="at lest one number";
            return;
        }
        if(!specal){
            ans.innerHTML="at lest one specal charactor"
            return;
        }
        if(password.length<8){
            ans.innerHTML="at lest 8 charactor reqired";
            return;
        }
        ans.innerHTML="verfied";
        ans.style.color="green";
        passwordEqual();
        return
    }
    function passwordEqual(){
        var pass=document.getElementById("pass").value;
        var cpass=document.getElementById("cpass").value;
        var ans=document.getElementById("cpassop");
        if(pass==""){
        ans.innerHTML="first set the password";
        ans.style.color="red";
        return
        }
        if(pass===cpass){
            ans.innerHTML="Success";
            ans.style.color="green";
            return
        }
        ans.innerHTML="Password not Match";
        ans.style.color="red";
    }