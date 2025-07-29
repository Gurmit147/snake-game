 var txtname = document.getElementById("name");
    var txtscore = document.getElementById("score");
    var txtlive = document.getElementById("live");
    var live = 3;
    var score = 0;
    var playername;
    let squareSize = 25;
    let foodx, foody;
    let snakex, snakey;
    let snakeBody = [];
    const speed = 25;
    let direction = "";
    let interval = null;
    let canvas, ctx;

    function generateFood() {
      foodx = Math.floor(Math.random() * (canvas.width / squareSize)) * squareSize;
      foody = Math.floor(Math.random() * (canvas.height / squareSize)) * squareSize;
    }

    function drawFood() {
      ctx.fillStyle = "red";
      ctx.fillRect(foodx, foody, squareSize, squareSize);
    }

    function drawSnake() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "green";
      ctx.fillRect(snakex, snakey, squareSize, squareSize);

      for (let i = 0; i < snakeBody.length; i++) {
        ctx.fillRect(snakeBody[i][0], snakeBody[i][1], squareSize, squareSize);
      }

      drawFood();
    }

    function moveSnake() {
      currentDirection = direction;

      for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
      }

      if (snakeBody.length > 0) {
        snakeBody[0] = [snakex, snakey];
      }

      switch (direction) {
        case "ArrowUp": snakey -= speed; break;
        case "ArrowDown": snakey += speed; break;
        case "ArrowLeft": snakex -= speed; break;
        case "ArrowRight": snakex += speed; break;
        default: return;
      }

      // Wall collision
      if (
        snakex < 0 || snakey < 0 ||
        snakex + squareSize > canvas.width ||
        snakey + squareSize > canvas.height
      ) {
        snakeBody = [];
        alert("You hit the wall!");
        snakex = (canvas.width - squareSize) / 2;
        snakey = (canvas.height - squareSize) / 2;
        live--;
        txtlive.innerText = "Live: " + live;

        if (live === 0) {
          alert("Game Over!");

          const gameData = {
            name: playername,
            score: score,
            date: new Date().toLocaleString()
          };

          let records = JSON.parse(localStorage.getItem("snake_game") || "[]");
          records.push(gameData);
          localStorage.setItem("snake_game", JSON.stringify(records));

          clearInterval(interval);
          interval = null;

          setTimeout(() => {
            location.href = "leaderboard.html";
          }, 100);
          return;
        }

        direction = "";
        clearInterval(interval);
        interval = null;
        drawSnake();
        drawFood();
        return;
      }

      // Self collision
      for (let i = 0; i < snakeBody.length; i++) {
        if (snakex === snakeBody[i][0] && snakey === snakeBody[i][1]) {
          snakeBody = [];
          alert("You hit yourself!");
          snakex = (canvas.width - squareSize) / 2;
          snakey = (canvas.height - squareSize) / 2;
          live--;
          txtlive.innerText = "Live: " + live;

          if (live === 0) {
            alert("Game Over!");

            const gameData = {
              name: playername,
              score: score,
              date: new Date().toLocaleString()
            };

            let records = JSON.parse(localStorage.getItem("snake_game") || "[]");
            records.push(gameData);
            localStorage.setItem("snake_game", JSON.stringify(records));

            clearInterval(interval);
            interval = null;

            setTimeout(() => {
              location.href = "leaderboard.html";
            }, 100);
            return;
          }

          direction = "";
          clearInterval(interval);
          interval = null;
          drawSnake();
          drawFood();
          return;
        }
      }

      // Food collision
      if (
        snakex < foodx + squareSize &&
        snakex + squareSize > foodx &&
        snakey < foody + squareSize &&
        snakey + squareSize > foody
      ) {
        score++;
        txtscore.innerText = "Score: " + score;
        snakeBody.push([snakex, snakey]);
        generateFood();
      }

      drawSnake();
    }

    let currentDirection = "";

    window.addEventListener("keydown", function (e) {
      const key = e.key;
      const validKeys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
      if (validKeys.includes(key)) {
        if (
          (key === "ArrowUp" && currentDirection !== "ArrowDown") ||
          (key === "ArrowDown" && currentDirection !== "ArrowUp") ||
          (key === "ArrowLeft" && currentDirection !== "ArrowRight") ||
          (key === "ArrowRight" && currentDirection !== "ArrowLeft")
        ) {
          direction = key;
        }

        if (!interval) {
          interval = setInterval(moveSnake, 100);
        }
      }
    });

    window.onload = function () {
      playername = prompt("Please enter your name");
      txtname.innerText = "Name: " + playername;
      txtlive.innerText = "Live: " + live;
      txtscore.innerText = "Score: " + score;

      canvas = document.getElementById("myCanvas");
      ctx = canvas.getContext("2d");

      snakex = (canvas.width - squareSize) / 2;
      snakey = (canvas.height - squareSize) / 2;

      generateFood();
      drawSnake();
    };