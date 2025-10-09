export function debounce<T extends (...args: any[]) => void>(fn: T, delayMs: number) {
    let timeout: any;
    return (...args: Parameters<T>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn(...args), delayMs);
    };
}


