export function validateBenchmark(input: BenchmarkInput): boolean {
  return input.value >= 0 && input.value <= 100;
}
