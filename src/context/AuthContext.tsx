import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";

import { auth } from "@/config/firebase.ts";

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const tokenResult = await firebaseUser.getIdTokenResult(true);
        const role = tokenResult.claims.role as string | undefined;

        if (role !== "SuperAdmin") {
          await signOut(auth);
          setState({
            user: null,
            loading: false,
            error: "Acceso denegado. Solo super administradores.",
          });
          return;
        }

        setState({ user: firebaseUser, loading: false, error: null });
      } else {
        setState({ user: null, loading: false, error: null });
      }
    });

    return unsubscribe;
  }, []);

  async function login(email: string, password: string) {
    setState((previous) => ({ ...previous, loading: true, error: null }));

    try {
      const credential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const tokenResult = await credential.user.getIdTokenResult(true);
      const role = tokenResult.claims.role as string | undefined;

      if (role !== "SuperAdmin") {
        await signOut(auth);
        setState({
          user: null,
          loading: false,
          error: "Acceso denegado. Solo super administradores.",
        });
        return;
      }

      setState({ user: credential.user, loading: false, error: null });
    } catch {
      setState({
        user: null,
        loading: false,
        error: "Credenciales inválidas.",
      });
    }
  }

  async function logout() {
    await signOut(auth);
    setState({ user: null, loading: false, error: null });
  }

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
