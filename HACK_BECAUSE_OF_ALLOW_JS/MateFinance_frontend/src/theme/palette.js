import { alpha } from '@mui/material/styles';
// ----------------------------------------------------------------------
// SETUP COLORS
export const grey = {
    0: '#FFFFFF',
    100: '#F9FAFB',
    200: '#F4F6F8',
    300: '#DFE3E8',
    400: '#C4CDD5',
    500: '#919EAB',
    600: '#637381',
    700: '#454F5B',
    800: '#212B36',
    900: '#161C24',
};
export const primary = {
    lighter: '#b2245e',
    light: '#93154e',
    main: '#9E2654',
    dark: '#9E2654',
    darker: '#9E2654',
    contrastText: '#FFFFFF',
    black: '#000000',
};
export const secondary = {
    lighter: '#d6e4ff',
    light: '#84a9ff',
    main: '#9E2654',
    dark: '#93154e',
    darker: '#091a7a',
    contrastText: '#FFFFFF',
};
export const info = {
    lighter: '#cafdf5',
    light: '#61f3f3',
    main: '#00b8d9',
    dark: '#006c9c',
    darker: '#003768',
    contrastText: '#ffffff',
};
export const success = {
    lighter: '#d8fbde',
    light: '#86e8ab',
    main: '#36b37e',
    dark: '#1b806a',
    darker: '#0a5554',
    contrastText: '#ffffff',
};
export const warning = {
    lighter: '#FFF5CC',
    light: '#FFD666',
    main: '#FFAB00',
    dark: '#B76E00',
    darker: '#7A4100',
    contrastText: grey[800],
};
export const error = {
    lighter: '#FFE9D5',
    light: '#FFAC82',
    main: '#f10e0e',
    dark: '#B71D18',
    darker: '#7A0916',
    contrastText: '#FFFFFF',
};
export const common = {
    black: '#000000',
    white: '#FFFFFF',
};
export const action = {
    hover: alpha(grey[500], 0.08),
    selected: alpha(grey[500], 0.16),
    disabled: alpha(grey[500], 0.8),
    disabledBackground: alpha(grey[500], 0.24),
    focus: alpha(grey[500], 0.24),
    hoverOpacity: 0.08,
    disabledOpacity: 0.48,
};
const base = {
    primary,
    secondary,
    info,
    success,
    warning,
    error,
    grey,
    common,
    divider: alpha(grey[500], 0.2),
    action,
};
// ----------------------------------------------------------------------
export function palette(mode) {
    const light = {
        ...base,
        mode: 'light',
        text: {
            primary: grey[800],
            secondary: grey[600],
            disabled: grey[500],
        },
        background: {
            paper: '#FFFFFF',
            default: '#FFFFFF',
            neutral: grey[200],
        },
        action: {
            ...base.action,
            active: grey[600],
        },
    };
    const dark = {
        ...base,
        mode: 'dark',
        text: {
            primary: '#FFFFFF',
            secondary: grey[500],
            disabled: grey[600],
        },
        background: {
            paper: grey[800],
            default: grey[900],
            neutral: alpha(grey[500], 0.12),
        },
        action: {
            ...base.action,
            active: grey[500],
        },
    };
    return mode === 'light' ? light : dark;
}
