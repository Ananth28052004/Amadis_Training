//java Scrept Arrays

var arr=[12,13,14,15,16];
arr.push(17);//add Element
console.log(arr);
arr.pop();//delete element
console.log(arr);
arr.shift()//remove first element
console.log(arr);
arr.unshift(10)//add first
console.log(arr);

let arr2=[5,4,3,2,1];
console.log(arr2);
let arr3=arr2.sort((a,b)=>a-b);//sort in array
console.log(arr3);

console.log(arr3.reverse());//reverse in array 
console.log(arr.join("-"))//array to string

var a=arr3.slice(1,3);//select specific element
console.log(a);

let s=[1,2,3,4,5,6,7,8,9,10];
s.splice(1,2)//delect paticluar element
console.log(s);

console.log(s.slice(1,3));// copy the array element


console.log(s.concat(a));//concat the array element

arr.forEach(function(A){
    console.log(A);              //use forEach loop 
})

let value=s.map(v=>v*2);//chenge all element in array
console.log(value);

let filterarray=s.filter(v=>v%2==0);
console.log(filterarray); //filter the array


let list=[1,2,3,4,5,6,7,8];
list.splice(1,3);
console.log(list.slice(1,1  ))
console.log(list);


let c=[1,3,4,6];

console.log(c.find(v=>v%2==0))
console.log();
