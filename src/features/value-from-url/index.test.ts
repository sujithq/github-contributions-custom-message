import { afterEach } from 'node:test';
import { describe, expect, it, vi } from 'vitest';
import { getValueFromURL, setValueInURL } from './index';

afterEach(() => {
    // Restore the original window object after each test
    vi.unstubAllGlobals();
});

describe('getValueFromURL', () => {
    let mockWindow: Partial<Window>;

    it('should return the value from the URL query string', () => {
        mockWindow = {
            location: {
                search: '?value=testValue&test=value',
            } as Location,
        };

        // Stub the global window object with our mock
        vi.stubGlobal('window', mockWindow);
        expect(getValueFromURL('value')).toBe('testValue');
    });

    it('should return an empty string if the value is not present in the URL', () => {
        mockWindow = {
            location: {
                search: '',
            } as Location,
        };
        // Stub the global window object with our mock
        vi.stubGlobal('window', mockWindow);

        expect(getValueFromURL('value')).toBe('');
    });
});

describe('setValueInURL', () => {
    let mockWindow: Partial<Window>;

    it('should set the value in the URL query string', () => {
        mockWindow = {
            location: {
                search: '?value=testValue&test=value',
            } as Location,
            history: {
                replaceState: vi.fn(),
            } as unknown as History, // Type assertion to avoid strict type issues
        };

        // Stub the global window object with our mock
        vi.stubGlobal('window', mockWindow);
        setValueInURL('value', 'newValue');
        expect(vi.mocked(window.history.replaceState)).toHaveBeenCalledWith(null, '', '?value=newValue&test=value');
    });

    it('should remove the value from the URL query string if value is null', () => {
        mockWindow = {
            location: {
                search: '?value=testValue&test=value',
            } as Location,
            history: {
                replaceState: vi.fn(),
            } as unknown as History, // Type assertion to avoid strict type issues
        };

        // Stub the global window object with our mock
        vi.stubGlobal('window', mockWindow);
        setValueInURL('value', null);
        expect(vi.mocked(window.history.replaceState)).toHaveBeenCalledWith(null, '', '?test=value');
    });
});
