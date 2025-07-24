export const getInitials = (fullName: string): string => {
    if (!fullName) return '';
    const parts = fullName.trim().split(' ').filter(Boolean);
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
};