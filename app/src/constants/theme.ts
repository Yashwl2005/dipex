export const Colors = {
    primary: '#2563EB', // Blue
    primaryDark: '#1E40AF',
    primaryLight: '#EFF6FF',
    white: '#FFFFFF',
    black: '#000000',
    textPrimary: '#111827',
    textSecondary: '#4B5563',
    textPlaceholder: '#9CA3AF',
    background: '#F9FAFB',
    cardBg: '#FFFFFF',
    border: '#E5E7EB',
    error: '#EF4444',
    success: '#10B981',
    warning: '#F59E0B',
    shadow: '#000000',
    progressBg: '#E5E7EB',
    progressFill: '#2563EB',
};

export const Spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 40,
};

export const Typography = {
    heading: {
        fontSize: 24,
        fontWeight: 'bold' as const,
        color: Colors.textPrimary,
    },
    subHeading: {
        fontSize: 18,
        fontWeight: '600' as const,
        color: Colors.textPrimary,
    },
    body: {
        fontSize: 16,
        color: Colors.textSecondary,
    },
    caption: {
        fontSize: 14,
        color: Colors.textSecondary,
    },
};
