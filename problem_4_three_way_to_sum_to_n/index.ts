/**
 * Iterative
 * @note : Good for small n, but inefficient for large n.
*/
const sum_to_n_a = (n: number) => {
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    sum += i;
  }
  return sum;
}

/**
 * Mathematical
 * @note : Most efficient, best choice for large n.
*/
const sum_to_n_b = (n: number) => {
  return (n * (n + 1)) / 2;
}

/**
 * Recursion
 * @note : Least efficient, may cause stack overflow.
*/
const sum_to_n_c = (n: number) => {
  if (n <= 0) return 0;
  return n + sum_to_n_c(n - 1);
}