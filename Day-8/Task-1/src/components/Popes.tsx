type Demo={
    name:string;
    age:number;
    village:string;
}

function Printing({name,age,village}:Demo){
    return(<>
    <h1>{name}{age}{village}</h1>
    </>)
}
export default Printing;