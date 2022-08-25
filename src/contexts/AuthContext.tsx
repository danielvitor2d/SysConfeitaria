import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  sendEmailVerification,
  signInWithEmailAndPassword,
  updatePassword,
  User,
} from "firebase/auth";
import { FC, ReactNode, useContext, useEffect } from "react";
import { useState, createContext } from "react";

import GlobalContext from "./GlobalContext";

interface AuthProviderProps {
  children: ReactNode;
}

interface AuthContextData {
  signed: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  changePassword: (new_password: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const { register } = useContext(GlobalContext);

  const auth = getAuth();

  const [signed, setSigned] = useState(false);

  async function signUp(email: string, password: string): Promise<boolean> {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(auth.currentUser as User);
      await register();

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async function changePassword(new_password: string): Promise<boolean> {
    try {
      const user = auth.currentUser;
      await updatePassword(user as User, new_password);
      return true;
    } catch (err) {
      console.log(err);
    }

    return false;
  }

  async function signIn(email: string, password: string): Promise<boolean> {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setSigned(true);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async function signOut() {
    await auth.signOut();
    setSigned(false);
  }

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setSigned(true);
        // if (auth.currentUser) {
        //   auth.currentUser.getIdToken(true).then(function (token) {
        //     let expires = new Date()
        //     expires.setTime(expires.getTime() + (10000))
        //     setCookie('access_token', token, { path: '/', expires })

        //     // Cookies.set('__session', token, {expires: 7});
        //   })
        // }
      } else {
        setSigned(false);
      }
    });
  }, []);

  // useEffect(() => {
  //   console.log("signed: " + signed);
  // }, [signed]);

  return (
    <AuthContext.Provider
      value={{ signed, signIn, signUp, signOut, changePassword }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
