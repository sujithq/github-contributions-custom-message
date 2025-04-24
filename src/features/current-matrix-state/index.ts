class CurrentMatrixState {
    private currentMatrix: number[][] | undefined | null = null;

    getMatrix(): number[][] | undefined | null {
        return this.currentMatrix;
    }

    setMatrix(matrix: number[][] | undefined | null): void {
        this.currentMatrix = matrix;
    }

    updateMatrix(rowIndex: number, colIndex: number, value: number): void {
        if (this.currentMatrix && this.currentMatrix[rowIndex] && this.currentMatrix[rowIndex][colIndex] !== undefined) {
            this.currentMatrix[rowIndex][colIndex] = value;
        }
    }

    resetMatrix(): void {
        this.currentMatrix = null;
    }
}

export const currentMatrixState = new CurrentMatrixState();