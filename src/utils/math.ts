export const rotateArray = <T>(array: T[], cols: number, rows: number): T[] => {
  const matrix: T[][] = [];
  for (let i = 0; i < rows; i++) {
    matrix.push(array.slice(i * cols, i * cols + cols));
  }
  const rotated = matrix[0].map((_val, index) => matrix.map(row => row[index]).reverse());
  return rotated.flat();
};
