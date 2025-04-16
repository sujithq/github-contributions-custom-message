export const getValueFromURL = (): string => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('value') || '';
};

export const setValueInURL = (value: string): void => {
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('value', value);
    window.history.replaceState(null, '', `?${urlParams.toString()}`);
};
