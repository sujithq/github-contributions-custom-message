import { charMatrixMap } from '@/features/generate/char-matrix-map';
import { describe, expect, it } from 'vitest';
import { generateContributionGrid } from './index';

describe('generateContributionGrid', () => {
    it('should generate the correct grid structure', () => {
        const gridContainer = document.createElement('div');
        const contributionsGrid = document.createElement('div');
        const creditsContainer = document.createElement('div');

        generateContributionGrid({
            gridContainer,
            contributionsGrid,
            creditsContainer,
            message: 'T',
            letters: {
                T: [
                    [1, 1, 1, 1, 1],
                    [0, 0, 1, 0, 0],
                    [0, 0, 1, 0, 0],
                    [0, 0, 1, 0, 0],
                    [0, 0, 1, 0, 0],
                    [0, 0, 1, 0, 0],
                    [0, 0, 1, 0, 0],
                ],
                ' ': [
                    [0, 0],
                    [0, 0],
                    [0, 0],
                    [0, 0],
                    [0, 0],
                    [0, 0],
                    [0, 0],
                ],
            },
            gridGap: '10px',
            minInputLength: 10,
            numRows: 7,
            charGap: 2,
        });

        expect(contributionsGrid.style.gridTemplateRows).toBe('repeat(7, 10px)'); // 7 rows of 10px each
        expect(contributionsGrid.style.gridTemplateColumns).toBe('repeat(45, 10px)'); // 5 (1 letter) + 20 (10 spaces by 2 columns) + 20 (10 gaps by 2)  = 45 columns of 10px each
        expect(contributionsGrid.children.length).toBe(315); // 7 rows * 45 columns = 315 squares
    });

    it('should generate the correct grid structure without letters map', () => {
        const gridContainer = document.createElement('div');
        const contributionsGrid = document.createElement('div');
        const creditsContainer = document.createElement('div');

        generateContributionGrid({
            gridContainer,
            contributionsGrid,
            creditsContainer,
            message: '**TEST**',
            letters: {},
            gridGap: '10px',
            minInputLength: 10,
            numRows: 7,
            charGap: 2,
        });

        expect(contributionsGrid.style.gridTemplateRows).toBe('repeat(7, 10px)'); // 7 rows of 10px each
        expect(contributionsGrid.style.gridTemplateColumns).toBe('repeat(0, 10px)'); //
        expect(contributionsGrid.children.length).toBe(0); //
    });

    it('should fill the grid with squares with correct classes', () => {
        const gridContainer = document.createElement('div');
        const contributionsGrid = document.createElement('div');
        const creditsContainer = document.createElement('div');

        generateContributionGrid({
            gridContainer,
            contributionsGrid,
            creditsContainer,
            message: 'L',
            letters: {
                L: [
                    // it's not a correct L, but for the tests it doesn't matter
                    [1, 0, 1, 0, 1],
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0],
                ],
            },
            minInputLength: 1,
            numRows: 7,
            charGap: 2,
        });

        const squares = contributionsGrid.querySelectorAll('.square');
        expect(squares.length).toBe(35); // 7 rows * 5 columns = 35 squares without gaps as the minimum length is 1
        for (let i = 0; i < squares.length; i++) {
            const square = squares[i];
            const isFilled = square.classList.contains('level-3') || square.classList.contains('level-4'); // Check if the square is filled
            const isEmpty = square.classList.contains('level-0') || square.classList.contains('level-1'); // Check if the square is empty
            if (i == 0 || i == 2 || i == 4) {
                expect(isFilled).toBe(true);
            } else {
                expect(isEmpty).toBe(true);
            }
        }
    });

    it('should set the correct grid container padding', () => {
        const gridContainer = document.createElement('div');
        const contributionsGrid = document.createElement('div');
        const creditsContainer = document.createElement('div');

        generateContributionGrid({
            gridContainer,
            contributionsGrid,
            creditsContainer,
            message: 'TEST',
            letters: charMatrixMap,
            paddingX: 10,
            paddingY: 15,
        });

        expect(gridContainer.style.paddingLeft).toBe('10px');
        expect(gridContainer.style.paddingRight).toBe('10px');
        expect(gridContainer.style.paddingTop).toBe('15px');
        expect(gridContainer.style.paddingBottom).toBe('15px');
    });

    it('should update the credits container correctly', () => {
        const gridContainer = document.createElement('div');
        const contributionsGrid = document.createElement('div');
        const creditsContainer = document.createElement('div');

        generateContributionGrid({
            gridContainer,
            contributionsGrid,
            creditsContainer,
            message: 'TEST',
            letters: charMatrixMap,
            creditsValue: 'Test Credits',
        });

        expect(creditsContainer.innerHTML).toBe('Test Credits');
        expect(creditsContainer.style.display).toBe('block');
    });
});
