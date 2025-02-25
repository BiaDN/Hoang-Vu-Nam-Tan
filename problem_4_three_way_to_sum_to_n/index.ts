// way 1: Iterative
const sum_to_n_a = (n: number) => {
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    sum += i;
  }
  return sum;
}

// way 2: Mathematical
const sum_to_n_b = (n: number) => {
  return (n * (n + 1)) / 2;
}

// way 3: Recursion
const sum_to_n_c = (n: number) => {
  if (n <= 0) return 0;
  return n + sum_to_n_c(n - 1);
}