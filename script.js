let stocks = [];

function addStock() {
  // Get stock details
  const name = document.getElementById("stock-name").value;
  const cost = parseInt(document.getElementById("stock-cost").value);
  const returnVal = parseInt(document.getElementById("stock-return").value);

  if (!name || isNaN(cost) || isNaN(returnVal)) {
    alert("Please enter valid stock details.");
    return;
  }

  // Add to stocks list
  stocks.push({ name, cost, return: returnVal });

  // Update stock list table
  updateStockList();

  // Clear input fields
  document.getElementById("stock-name").value = '';
  document.getElementById("stock-cost").value = '';
  document.getElementById("stock-return").value = '';
}

function updateStockList() {
  const stockTableBody = document.getElementById("stock-list").getElementsByTagName("tbody")[0];
  stockTableBody.innerHTML = '';

  stocks.forEach(stock => {
    const row = document.createElement("tr");
    row.innerHTML = `<td>${stock.name}</td><td>${stock.cost}</td><td>${stock.return}</td>`;
    stockTableBody.appendChild(row);
  });
}

function calculatePortfolio() {
  const budget = parseInt(document.getElementById("budget").value);

  if (isNaN(budget) || budget <= 0) {
    alert("Please enter a valid budget.");
    return;
  }

  // Get stock data (cost and return values)
  const costs = stocks.map(stock => stock.cost);
  const returns = stocks.map(stock => stock.return);
  const n = stocks.length;

  // Knapsack dynamic programming solution
  const result = knapsack(budget, costs, returns, n);

  // Display the result
  const selectedStocks = result.selectedItems.map(i => stocks[i].name).join(", ");
  const maxReturn = result.maxValue;
  document.getElementById("result").innerHTML = `
    <strong>Max Return: </strong>${maxReturn}<br>
    <strong>Selected Stocks: </strong>${selectedStocks}
  `;
}

function knapsack(capacity, costs, returns, n) {
  const dp = Array.from({ length: n + 1 }, () => Array(capacity + 1).fill(0));

  // Dynamic programming approach to solve the Knapsack problem
  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= capacity; w++) {
      if (costs[i - 1] <= w) {
        dp[i][w] = Math.max(
          returns[i - 1] + dp[i - 1][w - costs[i - 1]],
          dp[i - 1][w]
        );
      } else {
        dp[i][w] = dp[i - 1][w];
      }
    }
  }

  // Find the selected items
  const selectedItems = [];
  let w = capacity;
  for (let i = n; i > 0; i--) {
    if (dp[i][w] !== dp[i - 1][w]) {
      selectedItems.push(i - 1);
      w -= costs[i - 1];
    }
  }

  return {
    maxValue: dp[n][capacity],
    selectedItems
  };
}
