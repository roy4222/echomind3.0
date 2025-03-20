import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup,
  User,
  UserCredential,
  updateProfile,
  updateEmail,
  updatePassword,
  AuthError
} from 'firebase/auth';
import { auth } from '../firebase';

export const initializeAuthListener = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, (user) => {
    callback(user);
  });
};

export const updateUserProfile = async (
  displayName?: string,
  photoURL?: string
): Promise<void> => {
  try {
    if (!auth.currentUser) {
      throw new Error('沒有登入的用戶') as AuthError;
    }

    await updateProfile(auth.currentUser, {
      displayName,
      photoURL
    });
  } catch (error) {
    console.error('更新用戶資料失敗:', error);
    throw error as AuthError;
  }
};

export const updateUserEmail = async (newEmail: string): Promise<void> => {
  try {
    if (!auth.currentUser) {
      throw new Error('沒有登入的用戶') as AuthError;
    }

    await updateEmail(auth.currentUser, newEmail);
  } catch (error) {
    console.error('更新電子郵件失敗:', error);
    throw error as AuthError;
  }
};

export const updateUserPassword = async (newPassword: string): Promise<void> => {
  try {
    if (!auth.currentUser) {
      throw new Error('沒有登入的用戶') as AuthError;
    }

    await updatePassword(auth.currentUser, newPassword);
  } catch (error) {
    console.error('更新密碼失敗:', error);
    throw error as AuthError;
  }
};

export const registerWithEmail = async (
  email: string,
  password: string
): Promise<UserCredential> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential;
  } catch (error) {
    console.error('電子郵件註冊失敗:', error);
    throw error as AuthError;
  }
};

export const loginWithEmail = async (
  email: string, 
  password: string
): Promise<UserCredential> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential;
  } catch (error) {
    console.error('電子郵件登入失敗:', error);
    throw error as AuthError;
  }
};

export const loginWithGoogle = async (): Promise<UserCredential> => {
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    return userCredential;
  } catch (error) {
    console.error('Google 登入失敗:', error);
    throw error as AuthError;
  }
}; 