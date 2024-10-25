export const rotateArray = <T>(pads: T[], cols: number, rows: number): T[] => {
  const matrix: T[][] = [];
  for (let i = 0; i < rows; i++) {
    matrix.push(pads.slice(i * cols, i * cols + cols));
  }
  const rotated = matrix[0].map((val, index) => matrix.map(row => row[index]).reverse());
  return rotated.flat();
};
