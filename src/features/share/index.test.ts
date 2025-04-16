import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { shareContributionGrid } from './index';

// for some reason we have to mock window.alert separately (it doesn't work with vi.stubGlobal)
const mockedWindowAlert = vi.fn();
beforeEach(() => {
    window.alert = mockedWindowAlert; // Mock the alert function
});

afterEach(() => {
    // Restore the original window object after each test
    vi.unstubAllGlobals();
    // clear mocks
    vi.clearAllMocks(); // Clear all mocks after each test
});

describe('shareContributionGrid', () => {
    it('should call "navigator.share", disable the button and restore it after sharing', async () => {
        const mockWindow = {
            location: {
                href: 'https://github.artem.work?value=welcome',
            } as Location,
            history: {
                replaceState: vi.fn(),
            } as unknown as History, // Type assertion to avoid strict type issues
        };

        // Stub the global window object with our mock
        vi.stubGlobal('window', mockWindow);

        const mockGridContainer = document.createElement('div');
        const mockButton = document.createElement('button');
        mockButton.innerHTML = 'Share';

        const mockNavigatorShare = vi.fn();

        Object.assign(navigator, {
            share: mockNavigatorShare,
        });

        const promise = shareContributionGrid({
            gridContainer: mockGridContainer,
            button: mockButton,
        });

        expect(mockButton.getAttribute('disabled')).toBe('disabled');
        expect(mockButton.innerHTML).toBe('Sharing...');

        // resolve promise
        await promise;

        expect(mockNavigatorShare).toHaveBeenCalledWith({
            title: 'Custom GitHub Contributions Grid',
            text: 'Check out this custom GitHub contributions grid!',
            url: 'https://github.artem.work?value=welcome',
        });

        expect(mockButton.getAttribute('disabled')).toBeNull();
        expect(mockButton.innerHTML).toBe('Share');
    });

    it('should copy the URL to clipboard if Web Share API is unavailable', async () => {
        const mockWindow = {
            location: {
                href: 'https://github.artem.work?value=welcome',
            } as Location,
            history: {
                replaceState: vi.fn(),
            } as unknown as History, // Type assertion to avoid strict type issues
        };

        // Stub the global window object with our mock
        vi.stubGlobal('window', mockWindow);

        const mockGridContainer = document.createElement('div');
        const mockButton = document.createElement('button');
        mockButton.innerHTML = 'Share';

        const mockClipboardWriteText = vi.fn();

        Object.assign(navigator, {
            share: undefined,
            clipboard: { writeText: mockClipboardWriteText },
        });

        await shareContributionGrid({
            gridContainer: mockGridContainer,
            button: mockButton,
        });

        expect(mockClipboardWriteText).toHaveBeenCalledWith('https://github.artem.work?value=welcome');
    });

    it('should handle navigate.share error and show alert', async () => {
        const mockWindow = {
            location: {
                href: 'https://github.artem.work?value=welcome',
            } as Location,
        };
        // Stub the global window object with our mock
        vi.stubGlobal('window', mockWindow);

        const mockGridContainer = document.createElement('div');
        const mockButton = document.createElement('button');
        mockButton.innerHTML = 'Share';

        const mockNavigatorShare = vi.fn(() => {
            throw new Error('Sharing failed');
        });

        Object.assign(navigator, {
            share: mockNavigatorShare,
        });

        await shareContributionGrid({
            gridContainer: mockGridContainer,
            button: mockButton,
        });

        expect(mockedWindowAlert).toHaveBeenCalled();
        expect(mockButton.innerHTML).toBe('Share');
        expect(mockButton.getAttribute('disabled')).toBeNull();
    });

    it('should handle navigate.share error and do not show alert on AbortError', async () => {
        const mockWindow = {
            location: {
                href: 'https://github.artem.work?value=welcome',
            } as Location,
        };
        // Stub the global window object with our mock
        vi.stubGlobal('window', mockWindow);

        const mockGridContainer = document.createElement('div');
        const mockButton = document.createElement('button');
        mockButton.innerHTML = 'Share';

        const mockNavigatorShare = vi.fn(() => {
            const abortError = new Error('Sharing canceled by user');
            abortError.name = 'AbortError';
            throw abortError;
        });

        Object.assign(navigator, {
            share: mockNavigatorShare,
        });

        await shareContributionGrid({
            gridContainer: mockGridContainer,
            button: mockButton,
        });

        expect(mockedWindowAlert).not.toHaveBeenCalled();
        expect(mockButton.innerHTML).toBe('Share');
        expect(mockButton.getAttribute('disabled')).toBeNull();
    });

    it('should handle navigate.clipboard error and show alert', async () => {
        const mockWindow = {
            location: {
                href: 'https://github.artem.work?value=welcome',
            } as Location,
        };
        // Stub the global window object with our mock
        vi.stubGlobal('window', mockWindow);

        const mockGridContainer = document.createElement('div');
        const mockButton = document.createElement('button');
        mockButton.innerHTML = 'Share';

        const mockNavigatorClipboard = vi.fn(() => {
            throw new Error('Copying failed');
        });

        Object.assign(navigator, {
            share: undefined,
            clipboard: mockNavigatorClipboard,
        });

        await shareContributionGrid({
            gridContainer: mockGridContainer,
            button: mockButton,
        });

        expect(mockedWindowAlert).toHaveBeenCalled();
        expect(mockButton.innerHTML).toBe('Share');
        expect(mockButton.getAttribute('disabled')).toBeNull();
    });
});
