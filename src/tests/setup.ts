import '@testing-library/jest-dom';
import { beforeEach, vi } from 'vitest';

HTMLAnchorElement.prototype.click = vi.fn();

beforeEach(() => {
    vi.restoreAllMocks();
    vi.clearAllTimers();
    vi.useRealTimers();
    vi.unstubAllGlobals();
});
