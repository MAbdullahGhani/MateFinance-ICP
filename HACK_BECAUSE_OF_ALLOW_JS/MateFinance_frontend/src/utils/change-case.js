import { useSnackbar } from 'notistack';
export function paramCase(str) {
    return str
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
}
export function snakeCase(str) {
    return str
        .toLowerCase()
        .replace(/\s+/g, '_')
        .replace(/[^a-z0-9_]/g, '');
}
export const shortenHash = (hash, length) => {
    if (!hash)
        return '';
    return hash.substring(0, length) + '...';
};
export const handleCopy = (hash) => {
    navigator.clipboard
        .writeText(hash)
        .then(() => useSnackbar('Copied!'))
        .catch(() => useSnackbar('Failed to copy!'));
};
