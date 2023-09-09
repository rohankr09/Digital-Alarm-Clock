// Variables
let alarmListArr = [];

const selectMenu = document.querySelectorAll("select");
const setAlarmBtn = document.querySelector("#btn-setAlarm");

let alarmCount = 0;
let alarmTime;
let ring = new Audio("audio_Alarm-ringtone.mp3");


// Loading alarms from local storage on page load
function loadSavedAlarms()
{
    const savedAlarms = JSON.parse(localStorage.getItem('savedAlarms'));

    if (savedAlarms && savedAlarms.length > 0)
    {
        alarmListArr = savedAlarms;
        // Displaying saved alarms
        displayAlarms();
    }
}

// Calling the loadSavedAlarms function when the page loads
window.addEventListener('load', loadSavedAlarms);







// Script for Time and Date
function updateClock()
{
    var now = new Date();
    var dname = now.getDay(),
        mo = now.getMonth(),
        dnum = now.getDate(),
        yr = now.getFullYear(),
        hou = now.getHours(),
        min = now.getMinutes(),
        sec = now.getSeconds(),
        pe = "AM";

    if (hou == 0)
    {
        hou = 12;
    }
    if (hou > 12)
    {
        hou = hou - 12;
        pe = "PM";
    }

    Number.prototype.pad = function (digits)
    {
        for (var n = this.toString(); n.length < digits; n = 0 + n);
        return n;
    }

    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var weeks = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var ids = ["dayname", "month", "daynum", "year", "hours", "minutes", "seconds", "period"];

    var values = [weeks[dname], months[mo], dnum.pad(2), yr, hou.pad(2), min.pad(2), sec.pad(2), pe];

    for (var i = 0; i < ids.length; i++)
        document.getElementById(ids[i]).textContent = values[i];

    for (let i = 0; i < alarmListArr.length; i++)
    {
        if (alarmListArr[i] == `${hou.pad(2)}:${min.pad(2)}:${sec.pad(2)} ${pe}`)
        {
            console.log("Alarm ringing...");

            ring.load();
            ring.play();

            document.querySelector("#stopAlarm").style.visibility = "visible";
        }
    }
}

function initClock()
{
    updateClock();
    setInterval(updateClock, 1000);
}

initClock();







// Setting Alarm Section
for (let i = 12; i > 0; i--)
{
    i = i < 10 ? "0" + i : i;

    let option = `<option value="${i}">${i}</option>`;
    selectMenu[0].firstElementChild.insertAdjacentHTML("afterend", option);
}

for (let i = 59; i >= 0; i--)
{
    i = i < 10 ? "0" + i : i;

    let option = `<option value="${i}">${i}</option>`;
    selectMenu[1].firstElementChild.insertAdjacentHTML("afterend", option);
}

for (let i = 2; i > 0; i--)
{
    let ampm = i == 1 ? "AM" : "PM";

    let option = `<option value="${ampm}">${ampm}</option>`;
    selectMenu[2].firstElementChild.insertAdjacentHTML("afterend", option);
}






// Function to display alarms
function displayAlarms()
{
    document.querySelector("#alarm-h3").innerText = "Alarms";

    const alarmList = document.querySelector(".alarmList");
    alarmList.innerHTML = '';

    for (let i = 0; i < alarmListArr.length; i++)
    {
        const time = alarmListArr[i];
        const alarmCount = i + 1;

        alarmList.innerHTML += `
            <div class="alarmLog" id="alarm${alarmCount}">
                <span id="span${alarmCount}">${time}</span>
                <button class="btn-delete" id="${alarmCount}" onClick="deleteAlarm(this.id)">Delete</button>
            </div>`;
    }
}






// Adding alarm
function setAlarm()
{
    document.querySelector("#alarm-h3").innerText = "Alarms";

    let time = `${selectMenu[0].value}:${selectMenu[1].value}:00 ${selectMenu[2].value}`;

    if (time.includes("setHour") || time.includes("setMinute") || time.includes("AM/PM"))
    {
        alert("Please, Select Valid Input");
    }
    else
    {
        alarmCount++;
        alarmTime = `${selectMenu[0].value}:${selectMenu[1].value}:00 ${selectMenu[2].value}`;
        alarmListArr.push(alarmTime);

        // Saving the updated alarms to local storage
        localStorage.setItem('savedAlarms', JSON.stringify(alarmListArr));

        // Displaying alarms
        displayAlarms();
    }
}

setAlarmBtn.addEventListener("click", setAlarm);






// Deleting alarm
function deleteAlarm(click_id)
{
    var element = document.getElementById("alarm" + click_id);
    var deleteIndex = alarmListArr.indexOf(document.querySelector("#span" + click_id).innerText);

    alarmListArr.splice(deleteIndex, 1);
    element.remove();

    // Updating the saved alarms in local storage after deletion
    localStorage.setItem('savedAlarms', JSON.stringify(alarmListArr));
}

function stopAlarm()
{
    ring.pause();
    document.querySelector("#stopAlarm").style.visibility = "hidden";
}
