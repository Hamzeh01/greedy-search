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

function heuristic(city) {
  return heuristics[city];
}

function a_star(start, goal) {
  let openSet = new Set([start]);
  let cameFrom = {};
  let gScore = {};
  let fScore = {};

  cities.forEach((city) => {
    gScore[city] = Infinity;
    fScore[city] = Infinity;
  });
  gScore[start] = 0;
  fScore[start] = heuristic(start);

  while (openSet.size > 0) {
    let current = Array.from(openSet).reduce((a, b) =>
      fScore[a] < fScore[b] ? a : b
    );

    if (current === goal) {
      return reconstruct_path(cameFrom, current);
    }

    openSet.delete(current);

    for (let neighbor in graph[current]) {
      let tentative_gScore = gScore[current] + graph[current][neighbor];

      if (tentative_gScore < gScore[neighbor]) {
        cameFrom[neighbor] = current;
        gScore[neighbor] = tentative_gScore;
        fScore[neighbor] = gScore[neighbor] + heuristic(neighbor);
        openSet.add(neighbor);
      }
    }
  }

  return [];
}

function gbfs(start, goal) {
  let openSet = new Set([start]);
  let cameFrom = {};
  let fScore = {};

  cities.forEach((city) => {
    fScore[city] = Infinity;
  });
  fScore[start] = heuristic(start);

  while (openSet.size > 0) {
    let current = Array.from(openSet).reduce((a, b) =>
      fScore[a] < fScore[b] ? a : b
    );

    if (current === goal) {
      return reconstruct_path(cameFrom, current);
    }

    openSet.delete(current);

    for (let neighbor in graph[current]) {
      if (!cameFrom[neighbor]) {
        cameFrom[neighbor] = current;
        fScore[neighbor] = heuristic(neighbor);
        openSet.add(neighbor);
      }
    }
  }

  return [];
}

function reconstruct_path(cameFrom, current) {
  let total_path = [current];
  while (current in cameFrom) {
    current = cameFrom[current];
    total_path.push(current);
    if (total_path.length > cities.length) {
      throw new Error("Path reconstruction failed: possible infinite loop");
    }
  }
  return total_path.reverse();
}

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
    return;
  }

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
