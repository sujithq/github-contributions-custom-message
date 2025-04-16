import { describe, expect, it } from 'vitest';
import { sanitizeInput } from './sanitizer';

describe('sanitizeInput', () => {
    it('should remove invalid characters', () => {
        const input = 'Hello@World<script>alert("test")</script>!';
        const result = sanitizeInput(input, 50);
        expect(result).toBe('HelloWorldscriptalerttestscript!');
    });

    it('should limit the length of the input', () => {
        const input = 'This is a very long input string';
        const result = sanitizeInput(input, 10);
        expect(result).toBe('This is a ');
    });

    it('should allow valid characters', () => {
        const input = 'Valid-Input.123!';
        const result = sanitizeInput(input, 20);
        expect(result).toBe('Valid-Input.123!');
    });

    it('should handle empty input', () => {
        const input = '';
        const result = sanitizeInput(input);
        expect(result).toBe('');
    });

    it('should handle input with only invalid characters', () => {
        const input = '@#$%^&*()';
        const result = sanitizeInput(input);
        expect(result).toBe('');
    });
});
