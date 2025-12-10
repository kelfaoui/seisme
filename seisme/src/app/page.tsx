'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 to-blue-200 px-4">
  <div className="w-full max-w-2/3 bg-white p-10 rounded-3xl text-center py-10">
    
    {/* Centered h1 with icon */}
    <h1 className="text-blue-400 text-3xl font-bold mb-10 flex items-center justify-center gap-3">
      <svg className="w-12 h-12 icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" fill="#000000">
        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
          <path fill="#51a2ff" d="M926.784 480H701.312A192.512 192.512 0 00544 322.688V97.216A416.064 416.064 0 01926.784 480zm0 64A416.064 416.064 0 01544 926.784V701.312A192.512 192.512 0 00701.312 544h225.472zM97.28 544h225.472A192.512 192.512 0 00480 701.312v225.472A416.064 416.064 0 0197.216 544zm0-64A416.064 416.064 0 01480 97.216v225.472A192.512 192.512 0 00322.688 480H97.216z"></path>
        </g>
      </svg>
      <span>Seismo Assist</span>
    </h1>

    <p className="mb-6 text-gray-700 text-2xl mb-20">Bienvenue sur Seisme Assist</p>
    
    {/* Buttons Container - Responsive */}
    <div className="flex flex-col sm:flex-row gap-3 justify-center">
      <button 
        onClick={() => router.push('/login')}
        className="y-3 px-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md sm:flex-1"
      >
        Se connecter
      </button>
      
      <button 
        onClick={() => router.push("/dashboard")}
        className="py-3 px-6 bg-white border-2 border-blue-300 text-blue-500 font-medium rounded-xl hover:bg-blue-50 transition-colors duration-200 sm:flex-1"
      >
        Tableau de bord
      </button>
      
      <button 
        onClick={() => router.push('/signup')}
        className="py-3 px-6 bg-gradient-to-r to-blue-500 from-blue-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md sm:flex-1"
      >
        Créer un compte
      </button>
    </div>
  </div>
</div>
  );
}