"use client";

import { useEffect, useState } from "react";
import { auth, googleProvider } from "../lib/firebase";
import { onAuthStateChanged, signInWithPopup, signOut, User } from "firebase/auth";

export default function AuthBar() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => setUser(u));
  }, []);

  const handleLogin = async () => {
    await signInWithPopup(auth, googleProvider);
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  if (!user) {
    return (
      <button
        onClick={handleLogin}
        className="text-xs bg-white text-black px-3 py-1 rounded-full hover:bg-zinc-200"
      >
        Logg inn med Google
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="text-zinc-300">
        Innlogget som <strong>{user.displayName ?? user.email}</strong>
      </span>
      <button
        onClick={handleLogout}
        className="bg-zinc-800 px-2 py-1 rounded-full hover:bg-zinc-700"
      >
        Logg ut
      </button>
    </div>
  );
}
