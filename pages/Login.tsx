import React, { useState } from 'react';
import { TeamMember } from '../types';

interface LoginProps {
  onLogin: (user: TeamMember) => void;
  users: TeamMember[];
}

export const Login: React.FC<LoginProps> = ({ onLogin, users }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Try exact match first
    let user = users.find(u => u.name.toLowerCase() === username.toLowerCase() && u.password === password);

    // If not found and no password provided, try just username match (demo mode)
    if (!user && !password) {
      user = users.find(u => u.name.toLowerCase() === username.toLowerCase());
    }

    // If still not found, try username match if password is 'admin' (fallback)
    if (!user && password === 'admin') {
      user = users.find(u => u.name.toLowerCase() === username.toLowerCase());
    }

    if (user) {
      onLogin(user);
    } else {
      setError('Credenciales inválidas. Prueba "John Makhowsky" y "admin"');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4 transition-colors duration-300">
      <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-8 border border-slate-100 dark:border-slate-700">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <img src="/media/tugestify-alpha.png" alt="Tugestify" className="h-16 object-contain" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Bienvenido de nuevo</h1>
          <p className="text-slate-500 dark:text-slate-400">Introduce tus credenciales para acceder</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Usuario</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-violet-500 outline-none transition-all dark:text-white"
              placeholder="ej. John Makhowsky"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-violet-500 outline-none transition-all dark:text-white"
              placeholder="••••••"
            />
          </div>

          {error && <p className="text-rose-500 text-sm text-center bg-rose-50 dark:bg-rose-900/20 py-2 rounded-lg">{error}</p>}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white py-3.5 rounded-xl font-bold hover:shadow-lg hover:shadow-violet-500/25 transition-all transform active:scale-95"
          >
            Iniciar Sesión
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700 text-center">
          <p className="text-xs text-slate-400">Acceso Demo: Usuario "John Makhowsky", Contraseña "admin"</p>
        </div>
      </div>
    </div>
  );
};