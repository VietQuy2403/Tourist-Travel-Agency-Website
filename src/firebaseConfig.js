import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"; 

const firebaseConfig = {
  apiKey: "AIzaSyCBisNp3DrxU1HNutezCS5VfPkTnu5_xCI",
  authDomain: "hotel-5abee.firebaseapp.com",
  projectId: "hotel-5abee",
  storageBucket: "hotel-5abee.appspot.com",
  messagingSenderId: "509360434441",
  appId: "1:509360434441:web:fd486610ea1e896fb0b7d8",
  measurementId: "G-JZ0YPBWNVT"
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// ✅ Sửa hàm đăng ký tài khoản để trả về đúng `user.uid`
export const registerUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    // 🛠 Log toàn bộ dữ liệu trả về từ Firebase để kiểm tra
    console.log("🔥 userCredential từ Firebase:", userCredential);

    if (!userCredential || !userCredential.user || !userCredential.user.uid) {
      throw new Error("Firebase không trả về UID.");
    }

    return userCredential.user; // ✅ Trả về user có chứa UID
  } catch (error) {
    console.error("❌ Lỗi đăng ký Firebase:", error);
    throw new Error(error.message);
  }
};

// ✅ Hàm đăng nhập tài khoản
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("❌ Lỗi đăng nhập Firebase:", error);
    throw new Error(error.message);
  }
};
