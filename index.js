var bingoTables = [];
        var isGameOver = false;

        document.getElementById("form-gerar-tabelas").addEventListener("submit", function(e) {
            e.preventDefault();

            var player1 = document.getElementById("player1").value;
            var player2 = document.getElementById("player2").value;
            var player3 = document.getElementById("player3").value;

            generateBingoTables(player1, player2, player3);
        });

        function generateBingoTables(player1, player2, player3) {
            var tablesDiv = document.getElementById("bingo-tables");
            tablesDiv.innerHTML = "";

            var table1 = createBingoTable(player1);
            var table2 = createBingoTable(player2);
            var table3 = createBingoTable(player3);

            bingoTables = [table1, table2, table3];

            tablesDiv.appendChild(table1);
            tablesDiv.appendChild(table2);
            tablesDiv.appendChild(table3);
        }

        function createBingoTable(player) {
            var table = document.createElement("table");

            var numbers = generateRandomNumbers();

            for (var i = 0; i < numbers.length; i++) {
                var row = document.createElement("tr");

                for (var j = 0; j < numbers[i].length; j++) {
                    var cell = document.createElement("td");
                    cell.textContent = numbers[i][j];
                    row.appendChild(cell);
                }

                table.appendChild(row);
            }

            var middleCell = table.rows[2].cells[2];
            middleCell.textContent = "X";

            var caption = document.createElement("caption");
            caption.textContent = player;
            table.appendChild(caption);

            return table;
        }

        function generateRandomNumbers() {
            var numbers = [];
            var usedNumbers = [];

            for (var i = 1; i <= 75; i++) {
                usedNumbers.push(false);
            }

            for (var col = 0; col < 5; col++) {
                var columnNumbers = [];

                for (var row = 0; row < 5; row++) {
                    var number;

                    if (col === 0) {
                        number = getRandomNumberInRange(1, 15);
                    } else if (col === 1) {
                        number = getRandomNumberInRange(16, 30);
                    } else if (col === 2) {
                        number = getRandomNumberInRange(31, 45);
                    } else if (col === 3) {
                        number = getRandomNumberInRange(46, 60);
                    } else {
                        number = getRandomNumberInRange(61, 75);
                    }

                    while (usedNumbers[number - 1]) {
                        number = getRandomNumberInRange(col * 15 + 1, col * 15 + 15);
                    }

                    usedNumbers[number - 1] = true;
                    columnNumbers.push(number);
                }

                numbers.push(columnNumbers);
            }

            return numbers;
        }

        function getRandomNumberInRange(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        document.getElementById("start-game").addEventListener("click", function() {
            var drawnNumbersBody = document.getElementById("drawn-numbers-body");
            drawnNumbersBody.innerHTML = "";

            var numbers = [];
            for (var i = 1; i <= 75; i++) {
                numbers.push(i);
            }

            var interval = setInterval(function() {
                if (numbers.length === 0 || isGameOver) {
                    clearInterval(interval);
                    return;
                }

                var randomIndex = Math.floor(Math.random() * numbers.length);
                var drawnNumber = numbers.splice(randomIndex, 1)[0];

                var cell = document.createElement("td");
                cell.textContent = drawnNumber;

                if (drawnNumbersBody.childElementCount % 15 === 0) {
                    var newRow = document.createElement("tr");
                    newRow.appendChild(cell);
                    drawnNumbersBody.appendChild(newRow);
                } else {
                    var currentRow = drawnNumbersBody.lastElementChild;
                    currentRow.appendChild(cell);
                }

                markDrawnNumber(drawnNumber);
                checkWinningTables();
            }, 100);
        });

        function markDrawnNumber(number) {
            var tables = document.querySelectorAll("#bingo-tables table");

            tables.forEach(function(table) {
                var cells = table.getElementsByTagName("td");

                for (var i = 0; i < cells.length; i++) {
                    if (parseInt(cells[i].textContent) === number) {
                        cells[i].classList.add("marked");
                        break;
                    }
                }
            });
        }

        function checkWinningTables() {
            var winners = [];
            var winningTables = document.getElementsByClassName("winning-table");

            for (var i = 0; i < winningTables.length; i++) {
                winningTables[i].classList.remove("winning-table");
            }

            bingoTables.forEach(function(table, index) {
                var cells = table.getElementsByTagName("td");
                var allMarked = true;

                for (var i = 0; i < cells.length; i++) {
                    if (cells[i].textContent !== "X" && !cells[i].classList.contains("marked")) {
                        allMarked = false;
                        break;
                    }
                }

                if (allMarked) {
                    winners.push(index);
                    table.classList.add("winning-table");
                    isGameOver = true;
                }
            });

            if (winners.length > 0) {
                if (winners.length === 1) {
                    var winnerCaption = bingoTables[winners[0]].querySelector("caption");
                    winnerCaption.classList.add("winner");
                    winnerCaption.textContent += " (Vencedor)";
                    var winnerMessage = document.createElement("p");
                    winnerMessage.textContent = "Parabéns, " + winnerCaption.textContent + "!";
                    winnerMessage.classList.add("winner-message");
                    document.body.appendChild(winnerMessage);
                } else {
                    winners.forEach(function(winnerIndex) {
                        var caption = bingoTables[winnerIndex].querySelector("caption");
                        caption.classList.add("tie");
                        caption.textContent += " (Empate)";
                    });
                }
            }
        }

        document.getElementById("restart-game").addEventListener("click", function() {
            document.getElementById("form-gerar-tabelas").reset();
            document.getElementById("bingo-tables").innerHTML = "";
            document.getElementById("drawn-numbers-body").innerHTML = "";
            var winnerMessage = document.querySelector(".winner-message");
            if (winnerMessage) {
                winnerMessage.remove();
            }
            bingoTables = [];
            isGameOver = false;
        });