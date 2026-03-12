// services/benchmark-intelligence/logger.ts

export function logInfo(message: string) {
  console.log(`[INFO] ${new Date().toISOString()} - ${message}`);
}

export function logError(message: string, error?: unknown) {
  console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, error);
}

export function logBenchmarkRun(input: unknown, result: unknown) {
  console.log(`[BENCHMARK] ${new Date().toISOString()} - Input:`, input, "Result:", result);
}
