import { charMatrixMap } from './char-matrix-map';

/**
 * Converts a phrase into a matrix representation using the charMatrixMap.
 * @param phrase The input phrase to convert.
 * @param numRows The number of rows for the matrix.
 * @param gap The number of empty columns to add as a gap between characters.
 * @returns A 2D matrix representing the phrase.
 */
export const buildMatrixFromPhrase = (phrase: string, numRows = 7, gap = 2): number[][] => {
    const matrix: number[][] = [];

    if (phrase?.startsWith("[") && phrase?.endsWith("]")) {
        // If the phrase is a matrix, parse it and return as a 2D array
        try {
            const parsedMatrix = JSON.parse(phrase);
            return parsedMatrix.map((row: (number | string)[]) => row.map((col: number | string) => parseInt(col as string, 10)));
        } catch {
            // do nothing, work with the original phrase
        }
    }

    let current = 0;
    for (const char of phrase) {
        const charMatrix = charMatrixMap[char.toUpperCase()] || charMatrixMap[' ']; // Default to space if char not found

        for (let row = 0; row < numRows; row++) {
            if (!matrix[row]) {
                matrix[row] = [];
            }
            matrix[row] = matrix[row].concat(charMatrix[row] || []);
        }

        // Add a gap of empty columns between characters if it's not the last character
        if (current < phrase.length - 1) {
            for (let row = 0; row < numRows; row++) {
                matrix[row] = matrix[row].concat(Array(gap).fill(0));
            }
        }
        current++;
    }

    return matrix;
};