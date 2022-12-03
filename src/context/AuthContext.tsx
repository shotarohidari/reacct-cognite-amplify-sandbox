import { createContext, useContext } from "react"
import { useCogniteAuth } from "../hooks/useCogniteAuth"

type IAuthContext = {
  loggedIn: boolean
  confirmationNeeded: boolean
  signUp: (email: string, password: string) => Promise<void>
  confirmSignUp: (username: string, code: string) => Promise<void>
  signIn: (username: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}
const AuthContext = createContext<IAuthContext | undefined>(undefined)

export const AuthContextProvider = ({ children }: { children: any }) => {
  const [
    { loggedIn, confirmationNeeded },
    { signUp, confirmSignUp, signIn, signOut },
  ] = useCogniteAuth()
  return (
    <AuthContext.Provider
      value={{
        loggedIn,
        confirmationNeeded,
        signUp,
        confirmSignUp,
        signIn,
        signOut,
      }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if(context === undefined) {
        throw new Error("useAuthはAuthContextProvider内で呼び出される必要があります。");
    }
    return context;
}