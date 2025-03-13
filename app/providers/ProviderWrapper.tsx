import React, { ReactNode } from 'react';
import { AppProvider } from './AppProvider';
import { AuthProvider } from './AuthProvider';


interface ProviderWrapperProps {
    children: ReactNode;
}

const ProviderWrapper: React.FC<ProviderWrapperProps> = ({ children }) => {
    return (
        <AuthProvider>
            <AppProvider>
                {children}
            </AppProvider>
        </AuthProvider>
    );
};

export default ProviderWrapper;