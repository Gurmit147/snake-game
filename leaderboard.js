window.onload = function () {
    const leaderboardBody = document.getElementById("leaderboard-body");

    // Get all stored data
    const data = JSON.parse(localStorage.getItem("snake_game") || "[]");

    // Optional: sort by highest score
    data.sort((a, b) => b.score - a.score);

    // Populate table
    data.forEach(entry => {
      const row = document.createElement("tr");

      const nameCell = document.createElement("td");
      nameCell.innerText = entry.name;

      const scoreCell = document.createElement("td");
      scoreCell.innerText = entry.score;

      const dateCell = document.createElement("td");
      dateCell.innerText = entry.date;

      row.appendChild(nameCell);
      row.appendChild(scoreCell);
      row.appendChild(dateCell);

      leaderboardBody.appendChild(row);
    });
  };