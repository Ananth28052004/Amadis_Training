let habits = JSON.parse(localStorage.getItem("habits"))||[];
let moods = JSON.parse(localStorage.getItem("moods"))||{};
let journalEntries = JSON.parse(localStorage.getItem("journal"))||{};
document.getElementById("todayDate").textContent="Day: "+getToday();

function getToday(){
    return new Date().toISOString().split("T")[0];
}
function saveData(){
    localStorage.setItem("habits",JSON.stringify(habits));
    localStorage.setItem("moods",JSON.stringify(moods));
    localStorage.setItem("journal",JSON.stringify(journalEntries));
}

function addHabit(){
    let input=document.getElementById("habitInput");
    let name=input.value.trim();
    let find=habits.find(v=>v.name===name);
    if(name===""||find!==undefined){
        return;
    }
    habits.push({
        name:name,
        completedDates:[]
    });
    input.value = "";
    saveData();
    renderHabits();
    renderSummary();
}
function compliteHabit(index){
    let today=getToday();
    let habit=habits[index];
    let position=habit.completedDates.indexOf(today);
    if(position===-1){
        habit.completedDates.push(today);
    }else{
        habit.completedDates.splice(position,1);
    }
    saveData();
    renderHabits();
    renderSummary();
}
function deleteHabit(index){
    let check=confirm("Conform");
    if(check){
        habits.splice(index,1);
        saveData();
        renderHabits();
        renderSummary();
    }
}
function getStreak(habit){
    let streak=0;
    let date=new Date();
    if (habit.completedDates.indexOf(getToday())===-1){
        date.setDate(date.getDate()-1);
    }
    while(true){
        let dateStr=date.toISOString().split("T")[0];
        if (habit.completedDates.indexOf(dateStr)!==-1){
            streak++;
            date.setDate(date.getDate()-1);
        }
        else break;
    }
    return streak;
}
function renderHabits() {
    let list=document.getElementById("habitList");
    list.innerHTML="";
    if (habits.length===0) {
        list.innerHTML="<p>No habits added yet.</p>";
        return;
    }
    habits.forEach((habit,index)=>{
    let isDoneToday=habit.completedDates.indexOf(getToday())!==-1;
    let streak=getStreak(habit);
    let item=document.createElement("div");
    item.className="habit-item";
    item.innerHTML=`
        <div>
            <div class="habit-name">${habit.name}</div>
            <div class="streak">🔥${streak}day streak</div>
        </div>
        <div class="habit-buttons">
            <button class="${isDoneToday?'not-done-btn':'done-btn'}"onclick="compliteHabit(${index})">
            ${isDoneToday?"Undo":"Done"}</button>
            <button class="delete-btn"onclick="deleteHabit(${index})">Delete</button>
        </div>`;
    list.appendChild(item);
    });
}

const moodOptions=["😄","🙂","😐","😢","😠"];
function renderMoods(){
    let row=document.getElementById("moodRow");
    row.innerHTML="";
    let todayMood=moods[getToday()];
    moodOptions.forEach((emoji)=>{
            let span=document.createElement("span");
            span.textContent=emoji;
        if(emoji===todayMood){
            span.classList.add("selected");
        }
        span.addEventListener("click",()=>{
            moods[getToday()]=emoji;
            saveData();
            renderMoods();
            renderSummary();
        });
        row.append(span);
    });
}
document.getElementById("journalInput").value=journalEntries[getToday()] || "";

function saveJournal(){
    let text=document.getElementById("journalInput").value;
    if(text==="")return;
    journalEntries[getToday()]=text;
    saveData();
    alert("Journal saved!");
}
function renderSummary(){
    let totalHabits=habits.length;
    let doneToday=habits.filter(h => h.completedDates.indexOf(getToday())!==-1);
    doneToday=doneToday.length;
    let todayMood=moods[getToday()]||"not set";
    document.getElementById("summaryText").innerHTML=`
        Habits done today: <b>${doneToday} / ${totalHabits}</b><br>
        Today's mood: <b>${todayMood}</b>`;
}

renderHabits();
renderMoods();
renderSummary();

