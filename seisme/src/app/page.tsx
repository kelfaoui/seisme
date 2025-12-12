'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function Home() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      if (userStr && token) {
        try {
          const parsedUser = JSON.parse(userStr);
          setUser(parsedUser);
          setIsLoggedIn(true);
        } catch (e) {
          setIsLoggedIn(false);
        }
      } else {
        setIsLoggedIn(false);
      }
      setLoading(false);
    }
  }, []);

  // Rediriger automatiquement vers le dashboard si connecté
  useEffect(() => {
    if (isLoggedIn) {
      router.replace('/dashboard');
    }
  }, [isLoggedIn, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 to-blue-200">
        <div className="text-white text-xl">Chargement...</div>
      </div>
    );
  }

  // If user is logged in, redirect to dashboard
  if (isLoggedIn) {
    router.replace('/dashboard');
    return null;
  }

  // Show login/signup page for non-logged in users
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 to-blue-200 px-4">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-lg text-center px-8 sm:px-12 py-12 sm:py-16 space-y-10">
        <h1 className="text-blue-400 text-3xl font-bold mb-10 flex items-center justify-center gap-3">
          <svg className="w-12 h-12 icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" fill="#000000">
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
              <path fill="#51a2ff" d="M926.784 480H701.312A192.512 192.512 0 00544 322.688V97.216A416.064 416.064 0 01926.784 480zm0 64A416.064 416.064 0 01544 926.784V701.312A192.512 192.512 0 00701.312 544h225.472zM97.28 544h225.472A192.512 192.512 0 00480 701.312v225.472A416.064 416.064 0 0197.216 544zm0-64A416.064 416.064 0 01480 97.216v225.472A192.512 192.512 0 00322.688 480H97.216z"></path>
            </g>
          </svg>
          <span>Seismo Assist</span>
        </h1>
        
        <p className="text-gray-700 text-2xl sm:text-3xl mb-4">
          Bienvenue sur Seisme Assist
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => router.push('/login')}
              className="py-3 px-8 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md sm:w-48"
            >
              Se connecter
            </button>
            
            <button 
              onClick={() => router.push('/signup')}
              className="py-3 px-8 bg-gradient-to-r to-blue-500 from-blue-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md sm:w-48"
            >
              Créer un compte
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}