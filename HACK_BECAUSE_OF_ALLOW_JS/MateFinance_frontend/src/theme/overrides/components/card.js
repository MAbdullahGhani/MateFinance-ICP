// ----------------------------------------------------------------------
import { borderBottom } from '@mui/system';
export function card(theme) {
    return {
        MuiCard: {
            styleOverrides: {
                root: {
                    position: 'relative',
                    boxShadow: theme.customShadows.card,
                    borderRadius: theme.shape.borderRadius * 2,
                    zIndex: 0, // Fix Safari overflow: hidden with border radius
                },
            },
        },
        MuiCardHeader: {
            styleOverrides: {
                root: {
                    padding: theme.spacing(2),
                    borderBottom: `1px solid ${theme.palette.divider}`,
                },
            },
        },
        MuiCardContent: {
            styleOverrides: {
                root: {
                    padding: theme.spacing(3),
                },
            },
        },
    };
}
