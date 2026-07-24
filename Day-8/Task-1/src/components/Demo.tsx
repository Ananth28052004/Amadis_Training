import "../App.css"
function Show(){
    const iteam=["Apple","Orange","Banana","Pynaapple"];
    return(
        <>
        <ul className="ul">
            {iteam.map((val)=>(<li>{val}</li>))}
        </ul>
        </>
    );
}

export default Show;