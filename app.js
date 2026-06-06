let currentActivity = null;
let startTime = null;
let timerInterval = null;

const history = JSON.parse(localStorage.getItem("history")) || [];

updateHistory();
updateSummary();

function startActivity(activity) {

    if (currentActivity) {
        alert("Stoppa aktuell aktivitet först.");
        return;
    }

    currentActivity = activity;
    startTime = new Date();

    document.getElementById("currentActivity").textContent = activity;

    timerInterval = setInterval(updateTimer, 1000);
}

function stopActivity() {

    if (!currentActivity) return;

    clearInterval(timerInterval);

    const endTime = new Date();

    const duration =
        Math.floor((endTime - startTime) / 1000);

    history.push({
        activity: currentActivity,
        start: startTime.toLocaleString("sv-SE"),
        end: endTime.toLocaleString("sv-SE"),
        duration: duration
    });

    localStorage.setItem(
        "history",
        JSON.stringify(history)
    );

    currentActivity = null;
    startTime = null;

    document.getElementById("currentActivity").textContent = "Ingen";
    document.getElementById("timer").textContent = "00:00:00";

    updateHistory();
    updateSummary();
}

function updateTimer() {

    if (!startTime) return;

    const now = new Date();

    const seconds =
        Math.floor((now - startTime) / 1000);

    const hrs =
        String(Math.floor(seconds / 3600))
        .padStart(2, "0");

    const mins =
        String(Math.floor((seconds % 3600) / 60))
        .padStart(2, "0");

    const secs =
        String(seconds % 60)
        .padStart(2, "0");

    document.getElementById("timer").textContent =
        `${hrs}:${mins}:${secs}`;
}

function updateHistory() {

    const list =
        document.getElementById("historyList");

    list.innerHTML = "";

    history
        .slice()
        .reverse()
        .forEach(item => {

            const li =
                document.createElement("li");

            li.textContent =
                `${item.activity} | ${item.start} → ${item.end} (${Math.round(item.duration / 60)} min)`;

            list.appendChild(li);
        });
}

function updateSummary() {

    let drive = 0;
    let pause = 0;
    let rest = 0;

    history.forEach(item => {

        if (item.activity === "Körning")
            drive += item.duration;

        if (item.activity === "Rast")
            pause += item.duration;

        if (item.activity === "Vila")
            rest += item.duration;
    });

    document.getElementById("driveTotal").textContent =
        Math.round(drive / 60) + " min";

    document.getElementById("breakTotal").textContent =
        Math.round(pause / 60) + " min";

    document.getElementById("restTotal").textContent =
        Math.round(rest / 60) + " min";
}

function exportCSV() {

    let csv =
        "Aktivitet,Start,Slut,Varaktighet(sekunder)\n";

    history.forEach(item => {

        csv +=
            `${item.activity},${item.start},${item.end},${item.duration}\n`;
    });

    const blob =
        new Blob([csv], {
            type: "text/csv"
        });

    const url =
        window.URL.createObjectURL(blob);

    const a =
        document.createElement("a");

    a.href = url;
    a.download = "vilotid.csv";

    a.click();

    window.URL.revokeObjectURL(url);
}