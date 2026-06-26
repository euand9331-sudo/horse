const positions = [
  { name: "Walk", hr: 144, type: "aerobic", lactate: 2.2 },
  { name: "Sitting trot", hr: 140, type: "aerobic", lactate: 2.2 },
  { name: "Canter", hr: 133, type: "aerobic", lactate: 2.2 },
  { name: "Light-seat canter", hr: 162, type: "isometric", lactate: 3.5 },
  { name: "Jumping", hr: 169, type: "isometric", lactate: 4.7 }
];

function calculateTargetHR(restingHR, maxHR, intensity) {
  const hrr = maxHR - restingHR;
  return Math.round((hrr * intensity) + restingHR);
}

document.getElementById('calc-btn').addEventListener('click', function() {
  const restingHR = Number(document.getElementById('resting-hr').value);
  const maxHR = Number(document.getElementById('max-hr').value);
  const intensity = Number(document.getElementById('intensity').value) / 100;
  const targetHR = calculateTargetHR(restingHR, maxHR, intensity);
if (!restingHR || !maxHR || !intensity) {
  alert("Please fill in all fields!");
  return;
}

if (restingHR >= maxHR) {
  alert("Resting HR must be lower than Max HR!");
  return;
}
  document.getElementById('result').textContent = `Your Target HR ${targetHR} bpm`;

  const table = document.getElementById('results-table');
  while (table.rows.length > 1) table.deleteRow(1);

  positions.forEach(function(pos) {
    const percent = (pos.hr - restingHR) / (maxHR - restingHR) * 100;
    let label;
    if (pos.type === "isometric") {
      label = "High HR - holding position, not aerobic";
    } else if (percent < 60) {
      label = "Light";
    } else if (percent < 75) {
      label = "Moderate";
    } else if (percent < 90) {
      label = "Hard";
    } else {
      label = "Very Hard";
    }
    const row = table.insertRow();
      if (pos.type === "isometric") {
  row.style.backgroundColor = "salmon";
} else {
  row.style.backgroundColor = "lightgreen";
}
    row.innerHTML = `<td>${pos.name}</td><td>${pos.hr} bpm</td><td>${Math.round(percent)}%</td><td>${label}</td><td>${pos.lactate}</td>`;
  });
});
document.getElementById('download-btn').addEventListener('click', function() {
  const restingHR = Number(document.getElementById('resting-hr').value);
  const maxHR = Number(document.getElementById('max-hr').value);

  let text = "Position | Heart Rate | % of Reserve | Label\n";

  positions.forEach(function(pos) {
    const percent = (pos.hr - restingHR) / (maxHR - restingHR) * 100;
    let label;
    if (pos.type === "isometric") {
      label = "High HR - holding position, not aerobic";
    } else if (percent < 60) {
      label = "Light";
    } else if (percent < 75) {
      label = "Moderate";
    } else if (percent < 90) {
      label = "Hard";
    } else {
      label = "Very Hard";
    }
    text += `${pos.name} | ${pos.hr} bpm | ${Math.round(percent)}% | ${label}\n`;
  });

  const blob = new Blob([text], { type: "text/plain" });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = "heart_rate_results.txt";
  a.click();
});
