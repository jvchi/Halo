import { createContext, useContext } from "react";
import {
  ClerkProvider,
  RedirectToSignIn,
  useAuth as useClerkAuth,
  useUser,
} from "@clerk/react";

const AuthContext = createContext(null);
const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

function ClerkBridge({ children }) {
  const { isLoaded, isSignedIn, getToken } = useClerkAuth();
  const { user } = useUser();
  return (
    <AuthContext.Provider
      value={{
        configured: true,
        isLoaded,
        isSignedIn: Boolean(isSignedIn),
        getToken,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function AppAuthProvider({ children }) {
  if (publishableKey) {
    return (
      <ClerkProvider publishableKey={publishableKey}>
        <ClerkBridge>{children}</ClerkBridge>
      </ClerkProvider>
    );
  }
  return (
    <AuthContext.Provider
      value={{
        configured: import.meta.env.DEV,
        isLoaded: true,
        isSignedIn: import.meta.env.DEV,
        getToken: async () => null,
        user: null,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAppAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAppAuth must be used within AppAuthProvider");
  return value;
}

export function RequireAuth({ children }) {
  const auth = useAppAuth();
  if (!auth.isLoaded) return null;
  if (auth.isSignedIn) return children;
  if (auth.configured) return <RedirectToSignIn />;
  return null;
}
