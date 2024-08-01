export const getInitialsFromEmail = (email: string): string => {
    if (!email) return '';
    const [firstName, lastName] = email.split('@')[0].split('.');
    return (firstName.charAt(0) + (lastName?.charAt(0) || '')).toUpperCase();
  };
  