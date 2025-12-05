import React, { useState } from 'react';
import { TeamMember } from '../types';
import { UserPlus, Shield, Trash2, Pencil, X, Crown, User, Lock, Camera } from 'lucide-react';

interface TeamProps {
  members: TeamMember[];
  onAddMember: (member: TeamMember) => void;
  onUpdateMember: (member: TeamMember) => void;
  onDeleteMember: (memberId: string) => void;
  currentUser: TeamMember | null;
}

export const Team: React.FC<TeamProps> = ({ members, onAddMember, onUpdateMember, onDeleteMember, currentUser }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    password: '',
    avatar: '',
    customRole: ''
  });

  const isAdmin = currentUser?.isAdmin === true;

  const openAddModal = () => {
    setEditingMember(null);
    setFormData({ name: '', role: 'Diseñador', password: '', avatar: '', customRole: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (member: TeamMember) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      role: member.role,
      password: member.password || '',
      avatar: member.avatar,
      customRole: ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.password) return;

    const finalRole = formData.customRole || formData.role;
    const finalAvatar = formData.avatar || `https://i.pravatar.cc/150?u=${formData.name}`;

    if (editingMember) {
      // Update existing
      onUpdateMember({
        ...editingMember,
        name: formData.name,
        role: finalRole,
        password: formData.password,
        avatar: finalAvatar
      });
    } else {
      // Create new
      onAddMember({
        id: Date.now().toString(),
        name: formData.name,
        role: finalRole,
        password: formData.password,
        avatar: finalAvatar,
        isAdmin: false
      });
    }

    setIsModalOpen(false);
  };

  const predefinedRoles = [
    'Diseñador',
    'Desarrollador',
    'Marketing Manager',
    'Creative Director',
    'Brand Strategist',
    'Design Lead',
    'Product Manager',
    'UX Designer',
    'Content Creator',
    'Social Media Manager',
    'Otro (personalizado)'
  ];

  return (
    <div className="p-8 h-full overflow-y-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Miembros del Equipo</h2>
          <p className="text-slate-500 dark:text-slate-400">
            {isAdmin ? 'Gestiona usuarios, roles y permisos' : 'Visualiza los miembros del equipo'}
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={openAddModal}
            className="flex items-center space-x-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white px-5 py-2.5 rounded-xl font-medium hover:shadow-lg hover:shadow-violet-500/25 transition-all transform active:scale-95"
          >
            <UserPlus size={18} />
            <span>Añadir Miembro</span>
          </button>
        )}
      </div>

      {/* Admin Badge */}
      {isAdmin && (
        <div className="mb-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl flex items-center space-x-3">
          <Crown className="text-yellow-600 dark:text-yellow-400" size={24} />
          <div>
            <h3 className="font-bold text-slate-800 dark:text-white">Modo Administrador Activo</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">Tienes permisos completos para gestionar usuarios</p>
          </div>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-2xl border border-violet-100 dark:border-slate-700 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-xl text-slate-800 dark:text-white flex items-center space-x-2">
                {editingMember ? (
                  <>
                    <Pencil size={20} className="text-violet-500" />
                    <span>Editar Miembro</span>
                  </>
                ) : (
                  <>
                    <UserPlus size={20} className="text-violet-500" />
                    <span>Nuevo Miembro</span>
                  </>
                )}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nombre */}
              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  <User size={16} />
                  <span>Nombre Completo *</span>
                </label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 outline-none focus:border-violet-500 dark:text-white transition-all focus:ring-2 focus:ring-violet-500/20"
                  placeholder="Ej. María García"
                />
              </div>

              {/* Rol Predefinido */}
              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  <Shield size={16} />
                  <span>Profesión / Rol *</span>
                </label>
                <select
                  value={formData.role}
                  onChange={e => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 outline-none focus:border-violet-500 dark:text-white transition-all"
                >
                  {predefinedRoles.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>

              {/* Rol Personalizado */}
              {formData.role === 'Otro (personalizado)' && (
                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    <span>Especifica el rol personalizado *</span>
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.customRole}
                    onChange={e => setFormData({ ...formData, customRole: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 outline-none focus:border-violet-500 dark:text-white transition-all focus:ring-2 focus:ring-violet-500/20"
                    placeholder="Ej. Coordinador de Eventos"
                  />
                </div>
              )}

              {/* Foto */}
              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  <Camera size={16} />
                  <span>URL de Foto (opcional)</span>
                </label>
                <input
                  type="url"
                  value={formData.avatar}
                  onChange={e => setFormData({ ...formData, avatar: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 outline-none focus:border-violet-500 dark:text-white transition-all focus:ring-2 focus:ring-violet-500/20"
                  placeholder="https://ejemplo.com/foto.jpg"
                />
                <p className="text-xs text-slate-500 mt-1">Si no especificas una, se generará automáticamente</p>
              </div>

              {/* Contraseña */}
              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  <Lock size={16} />
                  <span>Contraseña *</span>
                </label>
                <input
                  required
                  type="text"
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 outline-none focus:border-violet-500 dark:text-white transition-all focus:ring-2 focus:ring-violet-500/20"
                  placeholder="Mínimo 4 caracteres"
                  minLength={4}
                />
                {editingMember && (
                  <p className="text-xs text-slate-500 mt-1">Dejar en blanco para mantener la contraseña actual</p>
                )}
              </div>

              {/* Botones */}
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 font-medium transition-colors border border-slate-200 dark:border-slate-600"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white py-2.5 rounded-xl hover:shadow-lg hover:shadow-violet-500/25 transition-all font-medium"
                >
                  {editingMember ? 'Guardar Cambios' : 'Crear Usuario'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cards de Usuarios */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {members.map(member => (
          <div key={member.id} className={`bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border flex flex-col items-center text-center relative group hover:shadow-lg transition-all ${member.isAdmin ? 'border-yellow-400 dark:border-yellow-600 shadow-yellow-100 dark:shadow-yellow-900/20' : 'border-slate-100 dark:border-slate-700'
            }`}>

            {/* Admin Badge */}
            {member.isAdmin && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold rounded-full flex items-center space-x-1 shadow-lg">
                <Crown size={12} />
                <span>ADMIN ROOT</span>
              </div>
            )}

            <img
              src={member.avatar}
              alt={member.name}
              className={`w-24 h-24 rounded-full object-cover mb-4 border-4 ${member.isAdmin ? 'border-yellow-200 dark:border-yellow-700' : 'border-slate-50 dark:border-slate-700'
                }`}
            />

            <h3 className="font-bold text-lg text-slate-800 dark:text-white">{member.name}</h3>

            <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium mt-2 ${member.isAdmin
              ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
              : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
              }`}>
              <Shield size={12} />
              <span>{member.role}</span>
            </span>

            {/* Password Display (solo para admin) */}
            {isAdmin && member.password && (
              <div className="mt-3 px-3 py-1.5 bg-slate-50 dark:bg-slate-900/50 rounded-lg text-xs text-slate-500 dark:text-slate-400 font-mono">
                🔑 {member.password}
              </div>
            )}

            {/* Edit/Delete Buttons - Solo para Admin y solo si no es el mismo admin-root */}
            {isAdmin && !member.isAdmin && (
              <div className="absolute top-4 right-4 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => openEditModal(member)}
                  className="p-2 bg-white dark:bg-slate-700 text-violet-500 dark:text-violet-400 rounded-lg shadow-md hover:shadow-lg transition-all hover:scale-110"
                  title="Editar usuario"
                >
                  <Pencil size={16} />
                </button>
                <button
                  className="p-2 bg-white dark:bg-slate-700 text-rose-500 dark:text-rose-400 rounded-lg shadow-md hover:shadow-lg transition-all hover:scale-110"
                  title="Eliminar usuario"
                  onClick={() => {
                    if (confirm(`¿Seguro que quieres eliminar a ${member.name}?\n\nEsta acción no se puede deshacer.`)) {
                      onDeleteMember(member.id);
                    }
                  }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Info Footer */}
      <div className="mt-8 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
        <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
          {isAdmin ? (
            <>
              <Crown className="inline mr-2" size={16} />
              <strong>Modo Administrador:</strong> Puedes crear, editar y eliminar usuarios. {members.length} miembros totales.
            </>
          ) : (
            <>
              <User className="inline mr-2" size={16} />
              Visualizando {members.length} miembros del equipo. Solo Admin Root puede gestionar usuarios.
            </>
          )}
        </p>
      </div>
    </div>
  );
};