const cities = [
  "Arad",
  "Bucharest",
  "Craiova",
  "Dobreta",
  "Eforie",
  "Fagaras",
  "Giurgiu",
  "Hirsova",
  "Iasi",
  "Lugoj",
  "Mehadia",
  "Neamt",
  "Oradea",
  "Pitesti",
  "Rimnicu Vilcea",
  "Sibiu",
  "Timisoara",
  "Urziceni",
  "Vaslui",
  "Zerind",
];

const graph = {
  Arad: { Zerind: 75, Sibiu: 140, Timisoara: 118 },
  Bucharest: { Fagaras: 211, Pitesti: 101, Giurgiu: 90, Urziceni: 85 },
  Craiova: { Dobreta: 120, Pitesti: 138, "Rimnicu Vilcea": 146 },
  Dobreta: { Mehadia: 75, Craiova: 120 },
  Eforie: { Hirsova: 86 },
  Fagaras: { Sibiu: 99, Bucharest: 211 },
  Giurgiu: { Bucharest: 90 },
  Hirsova: { Urziceni: 98, Eforie: 86 },
  Iasi: { Vaslui: 92, Neamt: 87 },
  Lugoj: { Timisoara: 111, Mehadia: 70 },
  Mehadia: { Lugoj: 70, Dobreta: 75 },
  Neamt: { Iasi: 87 },
  Oradea: { Zerind: 71, Sibiu: 151 },
  Pitesti: { "Rimnicu Vilcea": 97, Craiova: 138, Bucharest: 101 },
  "Rimnicu Vilcea": { Sibiu: 80, Pitesti: 97, Craiova: 146 },
  Sibiu: { Arad: 140, Oradea: 151, Fagaras: 99, "Rimnicu Vilcea": 80 },
  Timisoara: { Arad: 118, Lugoj: 111 },
  Urziceni: { Bucharest: 85, Hirsova: 98, Vaslui: 142 },
  Vaslui: { Iasi: 92, Urziceni: 142 },
  Zerind: { Arad: 75, Oradea: 71 },
};

const heuristics = {
  Arad: 366,
  Bucharest: 0,
  Craiova: 160,
  Dobreta: 242,
  Eforie: 161,
  Fagaras: 178,
  Giurgiu: 77,
  Hirsova: 151,
  Iasi: 226,
  Lugoj: 244,
  Mehadia: 241,
  Neamt: 234,
  Oradea: 380,
  Pitesti: 98,
  "Rimnicu Vilcea": 193,
  Sibiu: 253,
  Timisoara: 329,
  Urziceni: 80,
  Vaslui: 199,
  Zerind: 374,
};

/**
 * Heuristic function to estimate the cost to reach the goal from the current node.
 * @param {string} city - The name of the city.
 * @returns {number} The heuristic value for the city.
 */
function heuristic(city) {
  return heuristics[city];
}

/**
 * A* algorithm implementation to find the shortest path from start to goal.
 * @param {string} start - The starting city.
 * @param {string} goal - The goal city.
 * @returns {Array<string>} The shortest path from start to goal.
 */
function a_star(start, goal) {
  const openSet = new Set([start]); // Set of nodes to be evaluated
  const cameFrom = {}; // To reconstruct the path
  const gScore = {}; // Cost from start to the current node
  const fScore = {}; // Estimated total cost from start to goal through the current node

  cities.forEach((city) => {
    gScore[city] = Infinity; // Initialize gScore to infinity
    fScore[city] = Infinity; // Initialize fScore to infinity
  });
  gScore[start] = 0; // gScore of start is 0
  fScore[start] = heuristic(start); // fScore of start is its heuristic value

  while (openSet.size > 0) {
    // Current node is the one with the lowest fScore
    const current = Array.from(openSet).reduce((a, b) =>
      fScore[a] < fScore[b] ? a : b
    );

    if (current === goal) {
      return reconstructPath(cameFrom, current); // Goal reached, reconstruct path
    }

    openSet.delete(current); // Remove current node from openSet

    for (const neighbor in graph[current]) {
      const tentative_gScore = gScore[current] + graph[current][neighbor];

      if (tentative_gScore < gScore[neighbor]) {
        // Found a better path to the neighbor
        cameFrom[neighbor] = current;
        gScore[neighbor] = tentative_gScore;
        fScore[neighbor] = gScore[neighbor] + heuristic(neighbor);
        openSet.add(neighbor);
      }
    }
  }

  return []; // No path found
}

/**
 * Greedy Best-First Search (GBFS) algorithm implementation to find the shortest path from start to goal.
 * @param {string} start - The starting city.
 * @param {string} goal - The goal city.
 * @returns {Array<string>} The path from start to goal using GBFS.
 */
function gbfs(start, goal) {
  const openSet = new Set([start]); // Set of nodes to be evaluated
  const cameFrom = {}; // To reconstruct the path
  const visited = new Set(); // Set of nodes already evaluated

  while (openSet.size > 0) {
    // Current node is the one with the lowest heuristic value
    const current = Array.from(openSet).reduce((a, b) =>
      heuristic(a) < heuristic(b) ? a : b
    );

    if (current === goal) {
      return reconstructPath(cameFrom, current); // Goal reached, reconstruct path
    }

    openSet.delete(current); // Remove current node from openSet
    visited.add(current); // Add current node to visited set

    for (const neighbor in graph[current]) {
      if (!visited.has(neighbor)) {
        cameFrom[neighbor] = current;
        openSet.add(neighbor);
      }
    }
  }

  return []; // No path found
}

/**
 * Reconstructs the path from start to goal using the cameFrom map.
 * @param {Object} cameFrom - The map of navigated nodes.
 * @param {string} current - The current node.
 * @returns {Array<string>} The reconstructed path.
 */
function reconstructPath(cameFrom, current) {
  const totalPath = [current];
  while (current in cameFrom) {
    current = cameFrom[current];
    totalPath.push(current);
  }
  return totalPath.reverse();
}

/**
 * Handles the pathfinding when the button is clicked.
 */
function findPath() {
  const startCity = document.getElementById("start-city").value;
  const algorithm = document.getElementById("algorithm").value;
  const resultDiv = document.getElementById("result");

  let path = [];
  if (algorithm === "a_star") {
    path = a_star(startCity, "Bucharest");
  } else {
    path = gbfs(startCity, "Bucharest");
  }

  if (path.length === 0) {
    resultDiv.innerHTML = `<p>No path found</p>`;
  } else {
    const cost = path.reduce((sum, city, index) => {
      if (index < path.length - 1) {
        return sum + graph[city][path[index + 1]];
      }
      return sum;
    }, 0);

    resultDiv.innerHTML = `
      <h2>Best Path</h2>
      <p>${path.join(" -> ")}</p>
      <p>Cost: ${cost}</p>
    `;
  }
  resultDiv.classList.add("visible");
}

/**
 * Event listener for the theme switch.
 */
document
  .getElementById("theme-switch")
  .addEventListener("change", function (event) {
    const label = document.querySelector('label[for="theme-switch"]');
    if (event.target.checked) {
      document.body.classList.remove("light-mode");
      document.body.classList.add("dark-mode");
      label.textContent = "Enable Light Mode";
    } else {
      document.body.classList.remove("dark-mode");
      document.body.classList.add("light-mode");
      label.textContent = "Enable Dark Mode";
    }
  });
