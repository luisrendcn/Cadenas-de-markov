const { Matrix } = require("ml-matrix");

const EPSILON = 1e-10;
const DEFAULT_ITERATIONS = 10;
const MAX_ITERATIONS = 500;

function roundValue(value, precision = 10) {
  if (Math.abs(value) < EPSILON) {
    return 0;
  }

  return Number(value.toFixed(precision));
}

function roundVector(vector) {
  return vector.map((value) => roundValue(value));
}

function roundMatrix(matrix) {
  return matrix.map((row) => roundVector(row));
}

function assertFiniteNumber(value, label) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    throw new Error(`${label} must be a finite number.`);
  }

  return number;
}

function sanitizeIterations(iterations = DEFAULT_ITERATIONS) {
  const value = Number(iterations);

  if (!Number.isInteger(value) || value < 1) {
    throw new Error("Iterations must be a positive integer.");
  }

  if (value > MAX_ITERATIONS) {
    throw new Error(`Iterations are limited to ${MAX_ITERATIONS} to keep responses manageable.`);
  }

  return value;
}

function sanitizeMatrix(matrix) {
  if (!Array.isArray(matrix) || matrix.length === 0) {
    throw new Error("Transition matrix must be a non-empty square matrix.");
  }

  const size = matrix.length;
  const sanitized = matrix.map((row, rowIndex) => {
    if (!Array.isArray(row) || row.length !== size) {
      throw new Error("Transition matrix must be square.");
    }

    return row.map((cell, columnIndex) => {
      const value = assertFiniteNumber(cell, `P[${rowIndex + 1},${columnIndex + 1}]`);

      if (value < 0) {
        throw new Error("Transition probabilities cannot be negative.");
      }

      return value;
    });
  });

  return sanitized;
}

function sanitizeVector(vector, size, label = "Vector") {
  if (!Array.isArray(vector) || vector.length !== size) {
    throw new Error(`${label} must contain exactly ${size} values.`);
  }

  return vector.map((value, index) => {
    const number = assertFiniteNumber(value, `${label}[${index + 1}]`);

    if (number < 0) {
      throw new Error(`${label} values cannot be negative.`);
    }

    return number;
  });
}

function sanitizeCosts(costs, size) {
  if (costs === undefined || costs === null || costs === "") {
    return null;
  }

  if (!Array.isArray(costs) || costs.length !== size) {
    throw new Error(`Costs/revenues must contain exactly ${size} values.`);
  }

  return costs.map((value, index) => assertFiniteNumber(value, `Cost/revenue[${index + 1}]`));
}

function sanitizeStateNames(stateNames, size) {
  return Array.from({ length: size }, (_, index) => {
    const fallback = `State ${index + 1}`;
    const value = Array.isArray(stateNames) ? stateNames[index] : "";
    const text = String(value || "").trim();
    return text || fallback;
  });
}

function sum(values) {
  return values.reduce((total, value) => total + value, 0);
}

function dot(left, right) {
  return left.reduce((total, value, index) => total + value * right[index], 0);
}

function maxAbsDifference(left, right) {
  return left.reduce((largest, value, index) => Math.max(largest, Math.abs(value - right[index])), 0);
}

function normalizeVector(vector) {
  const total = sum(vector);

  if (Math.abs(total) < EPSILON) {
    throw new Error("Cannot normalize a vector with zero total.");
  }

  return vector.map((value) => value / total);
}

function transpose(matrix) {
  return matrix[0].map((_, columnIndex) => matrix.map((row) => row[columnIndex]));
}

function multiplyMatrices(left, right) {
  return new Matrix(left).mmul(new Matrix(right)).to2DArray();
}

function multiplyVectorMatrix(vector, matrix) {
  return new Matrix([vector]).mmul(new Matrix(matrix)).to2DArray()[0];
}

function buildWarnings(matrix, vector = null) {
  const warnings = [];

  matrix.forEach((row, index) => {
    const rowSum = sum(row);

    if (Math.abs(rowSum - 1) > 1e-8) {
      warnings.push(`Row ${index + 1} sums to ${roundValue(rowSum, 8)} instead of 1.`);
    }
  });

  if (vector) {
    const vectorSum = sum(vector);

    if (Math.abs(vectorSum - 1) > 1e-8) {
      warnings.push(`Initial vector sums to ${roundValue(vectorSum, 8)} instead of 1.`);
    }
  }

  return warnings;
}

function solveLinearSystem(coefficients, constants) {
  const size = constants.length;
  const augmented = coefficients.map((row, index) => [...row, constants[index]]);

  for (let column = 0; column < size; column += 1) {
    let pivotRow = column;
    let pivotValue = Math.abs(augmented[column][column]);

    for (let row = column + 1; row < size; row += 1) {
      const candidate = Math.abs(augmented[row][column]);

      if (candidate > pivotValue) {
        pivotRow = row;
        pivotValue = candidate;
      }
    }

    if (pivotValue < EPSILON) {
      throw new Error("Stationary system is singular.");
    }

    if (pivotRow !== column) {
      [augmented[column], augmented[pivotRow]] = [augmented[pivotRow], augmented[column]];
    }

    const pivot = augmented[column][column];

    for (let cursor = column; cursor <= size; cursor += 1) {
      augmented[column][cursor] /= pivot;
    }

    for (let row = 0; row < size; row += 1) {
      if (row === column) {
        continue;
      }

      const factor = augmented[row][column];

      for (let cursor = column; cursor <= size; cursor += 1) {
        augmented[row][cursor] -= factor * augmented[column][cursor];
      }
    }
  }

  return augmented.map((row) => row[size]);
}

function computePowersFromMatrix(matrix, iterations) {
  const powers = [];
  let current = matrix.map((row) => [...row]);

  for (let step = 1; step <= iterations; step += 1) {
    powers.push({
      step,
      matrix: roundMatrix(current)
    });

    if (step < iterations) {
      current = multiplyMatrices(current, matrix);
    }
  }

  return powers;
}

function computeEvolutionFromInputs(matrix, vector, iterations) {
  const steps = [
    {
      step: 0,
      vector: roundVector(vector)
    }
  ];

  let current = [...vector];

  for (let step = 1; step <= iterations; step += 1) {
    current = multiplyVectorMatrix(current, matrix);
    steps.push({
      step,
      vector: roundVector(current)
    });
  }

  return {
    steps,
    finalVector: steps[steps.length - 1].vector
  };
}

function computeStationaryFromMatrix(matrix) {
  const size = matrix.length;
  const system = transpose(matrix);

  // Solve (P^T - I)pi = 0 with sum(pi) = 1. This is the stationary eigenvector.
  for (let index = 0; index < size; index += 1) {
    system[index][index] -= 1;
  }

  const constants = Array(size).fill(0);
  system[size - 1] = Array(size).fill(1);
  constants[size - 1] = 1;

  try {
    const solved = solveLinearSystem(system, constants);
    const cleaned = solved.map((value) => (Math.abs(value) < 1e-9 ? 0 : value));
    const distribution = normalizeVector(cleaned);
    const residual = maxAbsDifference(multiplyVectorMatrix(distribution, matrix), distribution);

    if (distribution.every((value) => value >= -1e-7) && Number.isFinite(residual)) {
      const clipped = distribution.map((value) => Math.max(0, value));
      return {
        distribution: roundVector(normalizeVector(clipped)),
        method: "linear-system",
        residual: roundValue(residual, 12),
        converged: true,
        iterationsUsed: null
      };
    }
  } catch (error) {
    // Fall through to a power approximation for reducible or singular chains.
  }

  // Reducible chains can have multiple stationary distributions; a uniform start
  // gives a practical P^n approximation when the linear system is not unique.
  let current = Array(size).fill(1 / size);
  let converged = false;
  let iterationsUsed = 0;

  for (let iteration = 1; iteration <= 10000; iteration += 1) {
    const next = multiplyVectorMatrix(current, matrix);
    const delta = maxAbsDifference(next, current);
    current = next;
    iterationsUsed = iteration;

    if (delta < 1e-12) {
      converged = true;
      break;
    }
  }

  const distribution = normalizeVector(current.map((value) => Math.max(0, value)));
  const residual = maxAbsDifference(multiplyVectorMatrix(distribution, matrix), distribution);

  return {
    distribution: roundVector(distribution),
    method: "power-iteration",
    residual: roundValue(residual, 12),
    converged,
    iterationsUsed
  };
}

function computeCostsFromInputs(evolution, stationary, costs) {
  if (!costs) {
    return null;
  }

  const byStep = evolution.steps.map((entry) => ({
    step: entry.step,
    expectedValue: roundValue(dot(entry.vector, costs)),
    vector: entry.vector
  }));

  return {
    values: roundVector(costs),
    byStep,
    cumulativeExpectedValue: roundValue(sum(byStep.map((entry) => entry.expectedValue))),
    finalStepExpectedValue: byStep[byStep.length - 1].expectedValue,
    stationaryExpectedValue: roundValue(dot(stationary.distribution, costs))
  };
}

function prepareInput(payload = {}, options = {}) {
  const matrix = sanitizeMatrix(payload.matrix);
  const size = matrix.length;
  const iterations = sanitizeIterations(payload.iterations ?? DEFAULT_ITERATIONS);
  const stateNames = sanitizeStateNames(payload.stateNames, size);
  const vector = payload.vector === undefined || payload.vector === null
    ? null
    : sanitizeVector(payload.vector, size, "Initial vector");
  const costs = sanitizeCosts(payload.costs, size);

  if (options.requireVector && !vector) {
    throw new Error("Initial vector is required for this calculation.");
  }

  return {
    matrix,
    size,
    iterations,
    stateNames,
    vector,
    costs,
    warnings: buildWarnings(matrix, vector)
  };
}

function computePowers(payload) {
  const input = prepareInput(payload);

  return {
    input: {
      size: input.size,
      iterations: input.iterations,
      stateNames: input.stateNames
    },
    warnings: input.warnings,
    powers: computePowersFromMatrix(input.matrix, input.iterations)
  };
}

function computeEvolution(payload) {
  const input = prepareInput(payload, { requireVector: true });

  return {
    input: {
      size: input.size,
      iterations: input.iterations,
      stateNames: input.stateNames
    },
    warnings: input.warnings,
    evolution: computeEvolutionFromInputs(input.matrix, input.vector, input.iterations)
  };
}

function computeStationary(payload) {
  const input = prepareInput(payload);

  return {
    input: {
      size: input.size,
      stateNames: input.stateNames
    },
    warnings: input.warnings,
    stationary: computeStationaryFromMatrix(input.matrix)
  };
}

function computeCosts(payload) {
  const input = prepareInput(payload, { requireVector: true });
  const stationary = computeStationaryFromMatrix(input.matrix);
  const evolution = computeEvolutionFromInputs(input.matrix, input.vector, input.iterations);

  return {
    input: {
      size: input.size,
      iterations: input.iterations,
      stateNames: input.stateNames
    },
    warnings: input.warnings,
    costs: computeCostsFromInputs(evolution, stationary, input.costs)
  };
}

function computeAll(payload) {
  const input = prepareInput(payload, { requireVector: true });
  const powers = computePowersFromMatrix(input.matrix, input.iterations);
  const evolution = computeEvolutionFromInputs(input.matrix, input.vector, input.iterations);
  const stationary = computeStationaryFromMatrix(input.matrix);
  const costs = computeCostsFromInputs(evolution, stationary, input.costs);

  return {
    input: {
      size: input.size,
      iterations: input.iterations,
      stateNames: input.stateNames,
      matrix: roundMatrix(input.matrix),
      vector: roundVector(input.vector),
      costs: input.costs ? roundVector(input.costs) : null
    },
    warnings: input.warnings,
    powers,
    evolution,
    stationary,
    costs
  };
}

module.exports = {
  computeAll,
  computeCosts,
  computeEvolution,
  computePowers,
  computeStationary,
  multiplyMatrices,
  multiplyVectorMatrix
};
