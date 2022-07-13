import React from 'react';

export const AppContext = React.createContext({
    languageId: 'en',
    firstName: '',
    lastName: '',
    middleName: '',
    email: '',
    phoneNumber: '',
    avatar: null,
    country: '',
    isInPublicDirectory: false,
    biography: '',
    teamId: null,
    source: null,
    hasSource: false,
    onLanguageChange: () => {},
    onProfileChange: () => {},
    onHasNotification: (type, msg) => {},
});

AppContext.displayName = 'AppContext';