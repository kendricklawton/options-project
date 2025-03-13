'use client'

import React, { createContext, useContext, useState, useMemo, useCallback, useEffect, ReactNode } from 'react';
import { FirebaseError } from 'firebase/app';
import {
    EmailAuthProvider,
    createUserWithEmailAndPassword,
    deleteUser,
    GoogleAuthProvider,
    onAuthStateChanged,
    reauthenticateWithCredential,
    sendEmailVerification,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signInWithPopup,
    updateProfile,
    User,
    verifyBeforeUpdateEmail,
} from "firebase/auth";
import {
    auth
} from '../firebase';
import { AuthContextType } from '../types/types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [info, setInfo] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>(null);

    // Error Handling
    const handleError = useCallback((error: unknown) => {
        if (error instanceof FirebaseError) {
            switch (error.code) {
                case 'App/invalid-credential':
                    setInfo('Invalid credentials provided');
                    break;
                case 'App/email-already-in-use':
                    setInfo('Email already in use');
                    break;
                case 'App/invalid-email':
                    setInfo('Invalid email address');
                    break;
                case 'App/operation-not-allowed':
                    setInfo('Operation not allowed');
                    break;
                case 'App/weak-password':
                    setInfo('The password is too weak');
                    break;
                case 'App/too-many-requests':
                    setInfo('Access temporarily disabled due to many failed attempts');
                    break;
                default:
                    setInfo('Unknown FirebaseError, error.code: ' + error.code);
            }
        } else {
            setInfo('' + error);
        }

        throw error;
    }, []);

    // Auth Methods
    const createUserAccount = useCallback(async (email: string, password: string): Promise<void> => {
        setIsLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await sendEmailVerification(userCredential.user);
        } catch (error) {
            handleError(error);
        } finally {
            setIsLoading(false);
        }
    }, [handleError]);

    const deleteUserAccount = useCallback(async (password: string): Promise<void> => {
        setIsLoading(true);
        try {
            if (user) {
                const credential = EmailAuthProvider.credential(user.email!, password);
                await reauthenticateWithCredential(user, credential);
                await deleteUser(user);
                setUser(null);
                setInfo('User account deleted');
            }
        } catch (error) {
            handleError(error);
        } finally {
            setIsLoading(false);
        }
    }, [handleError, user]);

    const logIn = useCallback(async (email: string, password: string): Promise<void> => {
        setIsLoading(true);
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            setUser(userCredential.user);
            setInfo('Welcome back ' + userCredential.user.displayName);
        } catch (error) {
            handleError(error);
        } finally {
            setIsLoading(false);
        }
    }, [handleError]);

    const logInWithGoogle = useCallback(async (): Promise<void> => {
        setIsLoading(true);
        try {
            const userCredential = await signInWithPopup(auth, new GoogleAuthProvider());
            setUser(userCredential.user);
        } catch (error) {
            handleError(error);
        } finally {
            setIsLoading(false);
        }
    }, [handleError]);

    const logOut = useCallback(async (): Promise<void> => {
        setIsLoading(true);
        try {
            await auth.signOut();
            setUser(null);
            setInfo('Logged out');
        } catch (error) {
            handleError(error);
        } finally {
            setIsLoading(false);
        }
    }, [handleError]);

    const sendPasswordReset = useCallback(async (email: string): Promise<void> => {
        setIsLoading(true);
        try {
            await sendPasswordResetEmail(auth, email);
            setInfo('Password reset email sent');
        } catch (error) {
            handleError(error);
        } finally {
            setIsLoading(false);
        }
    }, [handleError]);

    const sendUserVerification = useCallback(async (): Promise<void> => {
        setIsLoading(true);
        try {
            if (user) {
                await sendEmailVerification(user);
                setInfo('Verification email sent');
            } else {
                throw new Error('User not found.');
            }
        } catch (error) {
            handleError(error);
        } finally {
            setIsLoading(false);
        }
    }, [user, handleError]);

    const updateUserDisplayName = useCallback(async (newDisplayName: string): Promise<void> => {
        setIsLoading(true);
        try {
            if (user) {
                await updateProfile(user, { displayName: newDisplayName });
                setInfo('Display name to ' + newDisplayName);
            } else {
                throw new Error('User not found.');
            }
        } catch (error) {
            handleError(error);
        } finally {
            setIsLoading(false);
        }
    }, [user, handleError]);

    const updateUserEmail = useCallback(async (newEmail: string, password: string): Promise<void> => {
        setIsLoading(true);
        try {
            if (!user) {
                throw new Error('User not found.');
            }
            const credential = EmailAuthProvider.credential(user.email!, password);
            await reauthenticateWithCredential(user, credential);
            await verifyBeforeUpdateEmail(user, newEmail);
            setInfo('Email verification sent to ' + newEmail);
        } catch (error) {
            handleError(error);
        } finally {
            setIsLoading(false);
        }
    }, [user, handleError]);

    // Auth State Listener
    useEffect(() => {
        if (!auth) {
            console.error('Firebase App is not initialized');
            return;
        }
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setIsLoading(true);
            setUser(currentUser || null);
            setIsLoading(false);
        });
        return () => unsubscribe();
    }, [user]);

    const contextValue = useMemo(() => ({
        info,
        isLoading,
        user,
        createUserAccount,
        deleteUserAccount,
        logIn,
        logInWithGoogle,
        logOut,
        sendPasswordReset,
        sendUserVerification,
        setInfo,
        setIsLoading,
        updateUserDisplayName,
        updateUserEmail,
    }), [
        info,
        isLoading,
        user,
        createUserAccount,
        deleteUserAccount,
        logIn,
        logInWithGoogle,
        logOut,
        sendPasswordReset,
        sendUserVerification,
        updateUserDisplayName,
        updateUserEmail,
    ]);

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within AppProvider');
    }
    return context;
};