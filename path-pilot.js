const readline = require('readline')
console.log("PATH PILOT v0.1 (A* Search)")

class Graph {
    constructor() {
      this.vertices = new Map()// Map to store vertices and their adjacent vertices with distances
    }
  
    addVertex(vertex) {
      this.vertices.set(vertex, new Map())
    }
  
    addEdge(vertex1, vertex2, distance) {
      this.vertices.get(vertex1).set(vertex2, distance)
      this.vertices.get(vertex2).set(vertex1, distance) 
      // undirected graph
    }
  
    getDistance(vertex1, vertex2) {
      return this.vertices.get(vertex1).get(vertex2)
    }
  
    heuristicCostEstimate(start, goal) {
      return 0 // For simplicity, returning 0 as a placeholder
    }
  
    aStar(start, goal) {
      const openSet = new Set([start])
      const cameFrom = new Map()
      const gScore = new Map()
      const fScore = new Map()
      gScore.set(start, 0)
      fScore.set(start, this.heuristicCostEstimate(start, goal))
  
      while (openSet.size > 0) {
        const current = Array.from(openSet).reduce((a, b) => (fScore.get(a) < fScore.get(b) ? a : b))
  
        if (current === goal) {
          // Reconstruct the path
          const path = []
          let currentStep = current
          while (cameFrom.has(currentStep)) {
            path.unshift(currentStep)
            currentStep = cameFrom.get(currentStep)
          }
          path.unshift(start)
          return path
        }
  
        openSet.delete(current)
  
        for (const neighbor of this.vertices.get(current).keys()) {
          const tentativeGScore = gScore.get(current) + this.getDistance(current, neighbor)
  
          if (!gScore.has(neighbor) || tentativeGScore < gScore.get(neighbor)) {
            cameFrom.set(neighbor, current)
            gScore.set(neighbor, tentativeGScore)
            fScore.set(neighbor, tentativeGScore + this.heuristicCostEstimate(neighbor, goal))
  
            if (!openSet.has(neighbor)) {
              openSet.add(neighbor)
            }
          }
        }
      }
  
      return null; // No path found
    }
  }
  
  // Example usage:
  
  const roadNetwork = new Graph();
  
  roadNetwork.addVertex('Beach')
  roadNetwork.addVertex('Metro')
  roadNetwork.addVertex('Valley')
  roadNetwork.addVertex('Plateau')
  roadNetwork.addVertex('Mountain')
  roadNetwork.addVertex('Desert')
  
  console.log("Will show shortest distance from from startLocation to goalLocation variables")

  console.log("connecting landmarks...")
  roadNetwork.addEdge('Plateau', 'Metro', 25)
  roadNetwork.addEdge('Metro', 'Valley', 18)
  roadNetwork.addEdge('Valley', 'Plateau', 43)
  roadNetwork.addEdge('Plateau', 'Beach', 17)
  roadNetwork.addEdge('Valley', 'Mountain', 130)
  roadNetwork.addEdge('Mountain', 'Desert', 164)
  roadNetwork.addEdge('Metro', 'Desert', 19)
  roadNetwork.addEdge('Beach', 'Mountain', 23)
  console.log("====================")

  
  const startLocation = 'Mountain'
  const goalLocation = 'Metro'
  
  const path = roadNetwork.aStar(startLocation, goalLocation)
  
  if (path) {
    let totalDistance = 0

    for(let i = 0; i < path.length - 1; i++) {
        const currentVertex = path[i]
        const nextVertex = path[i + 1]
        const edgeDistance = roadNetwork.getDistance(currentVertex,nextVertex)
        totalDistance += edgeDistance
    }

    console.log(`Path from ${startLocation} to ${goalLocation}: ${path.join(' -> ')}`)
    console.log(`Total distance: ${totalDistance}`)
  } else {
    console.log(`No path found from ${startLocation} to ${goalLocation}`)
  }
  