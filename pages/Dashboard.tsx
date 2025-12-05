import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Legend } from 'recharts';
import { Asset, ActivityLog, TeamMember, Project, ChatMessage } from '../types';
import { ArrowUpRight, Folder, Image as ImageIcon, Users, MessageCircle, CheckCircle2, TrendingUp, Award, Trophy, Medal } from 'lucide-react';

interface DashboardProps {
  assets: Asset[];
  logs: ActivityLog[];
  teamMembers: TeamMember[];
  projects: Project[];
  chatMessages: ChatMessage[];
}

const data = [
  { name: 'Ene', uploads: 40, downloads: 24 },
  { name: 'Feb', uploads: 30, downloads: 13 },
  { name: 'Mar', uploads: 20, downloads: 58 },
  { name: 'Abr', uploads: 27, downloads: 39 },
  { name: 'May', uploads: 18, downloads: 48 },
  { name: 'Jun', uploads: 23, downloads: 38 },
  { name: 'Jul', uploads: 34, downloads: 43 },
];

const COLORS = ['#8b5cf6', '#ec4899', '#06b6d4', '#f59e0b', '#10b981', '#f97316'];
const MEMBER_COLORS = ['#8b5cf6', '#ec4899', '#06b6d4', '#f59e0b', '#10b981', '#f97316'];

export const Dashboard: React.FC<DashboardProps> = ({ assets, logs, teamMembers, projects, chatMessages }) => {
  const assetDistribution = [
    { name: 'Iconos', value: assets.filter(a => a.category === 'icons').length },
    { name: 'Folletos', value: assets.filter(a => a.category === 'flyers').length },
    { name: 'Info', value: assets.filter(a => a.category === 'infographics').length },
    { name: 'Web', value: assets.filter(a => a.category === 'web-screenshots').length },
  ];

  // Calcular estadísticas por miembro
  const getMemberStats = (member: TeamMember) => {
    // Total de acciones (logs que incluyen el nombre del miembro)
    const totalActions = logs.filter(log => log.user === member.name).length;

    // Proyectos en los que ha trabajado (etapas completadas por este miembro)
    const projectsWorkedOn = new Set<string>();
    projects.forEach(project => {
      project.stages.forEach(stage => {
        if (stage.completedBy === member.name) {
          projectsWorkedOn.add(project.id);
        }
      });
    });

    // Últimos mensajes del chat (máximo 3)
    const memberMessages = chatMessages
      .filter(msg => msg.userId === member.id)
      .slice(-3)
      .reverse();

    // Tareas completadas
    const tasksCompleted = projects.reduce((total, project) => {
      return total + project.stages.filter(s => s.completedBy === member.name).length;
    }, 0);

    return {
      totalActions,
      projectsCount: projectsWorkedOn.size,
      lastMessages: memberMessages,
      tasksCompleted
    };
  };

  return (
    <div className="p-8 space-y-8 overflow-y-auto h-full">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Archivos', value: assets.length, icon: Folder, color: 'bg-violet-500' },
          { label: 'Almacenamiento', value: '2.4 GB', icon: ImageIcon, color: 'bg-pink-500' },
          { label: 'Miembros Equipo', value: teamMembers.length, icon: Users, color: 'bg-cyan-500' },
          { label: 'Crecimiento', value: '+12%', icon: ArrowUpRight, color: 'bg-amber-500' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center space-x-4">
            <div className={`p-4 rounded-xl ${stat.color} text-white shadow-lg shadow-violet-500/20`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Team Member Analytics Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center space-x-2">
            <Award className="text-violet-600" size={28} />
            <span>Rendimiento del Equipo</span>
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Estadísticas individuales</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {teamMembers.map(member => {
            const stats = getMemberStats(member);
            return (
              <div key={member.id} className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all">
                {/* Header */}
                <div className="flex items-center space-x-4 mb-5 pb-5 border-b border-slate-200 dark:border-slate-700">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-16 h-16 rounded-full border-4 border-white dark:border-slate-800 shadow-lg"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white">{member.name}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{member.role}</p>
                  </div>
                  {member.isAdmin && (
                    <div className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs font-bold rounded-full">
                      ADMIN
                    </div>
                  )}
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-4 mb-5">
                  <div className="text-center p-3 bg-violet-50 dark:bg-violet-900/20 rounded-xl border border-violet-100 dark:border-violet-900/40">
                    <div className="flex items-center justify-center mb-1">
                      <TrendingUp className="text-violet-600 dark:text-violet-400" size={20} />
                    </div>
                    <p className="text-2xl font-bold text-violet-600 dark:text-violet-400">{stats.totalActions}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Acciones</p>
                  </div>

                  <div className="text-center p-3 bg-pink-50 dark:bg-pink-900/20 rounded-xl border border-pink-100 dark:border-pink-900/40">
                    <div className="flex items-center justify-center mb-1">
                      <Folder className="text-pink-600 dark:text-pink-400" size={20} />
                    </div>
                    <p className="text-2xl font-bold text-pink-600 dark:text-pink-400">{stats.projectsCount}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Proyectos</p>
                  </div>

                  <div className="text-center p-3 bg-cyan-50 dark:bg-cyan-900/20 rounded-xl border border-cyan-100 dark:border-cyan-900/40">
                    <div className="flex items-center justify-center mb-1">
                      <CheckCircle2 className="text-cyan-600 dark:text-cyan-400" size={20} />
                    </div>
                    <p className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">{stats.tasksCompleted}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Tareas</p>
                  </div>
                </div>

                {/* Last Messages */}
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center space-x-2 mb-3">
                    <MessageCircle className="text-violet-600 dark:text-violet-400" size={16} />
                    <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Últimos Mensajes</h4>
                  </div>
                  {stats.lastMessages.length > 0 ? (
                    <div className="space-y-2">
                      {stats.lastMessages.map((msg, idx) => (
                        <div key={idx} className="text-xs bg-white dark:bg-slate-700 p-2 rounded-lg border border-slate-100 dark:border-slate-600">
                          <p className="text-slate-700 dark:text-slate-300 line-clamp-2">{msg.content}</p>
                          <p className="text-slate-400 text-[10px] mt-1">{msg.timestamp}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic">Sin mensajes recientes</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Activity by Member Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <TrendingUp className="text-violet-500" size={22} />
              Actividad por Miembro
            </h3>
            <div className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full">
              Basado en registros
            </div>
          </div>
          
          <div className="flex gap-6">
            {/* Members List - Left Side */}
            <div className="w-48 space-y-2 flex-shrink-0">
              {teamMembers
                .map(member => ({
                  ...member,
                  actions: logs.filter(log => log.user === member.name).length
                }))
                .sort((a, b) => b.actions - a.actions)
                .map((member, idx) => (
                  <div 
                    key={member.id} 
                    className={`flex items-center gap-3 p-2 rounded-xl transition-all ${idx === 0 ? 'bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border border-yellow-200 dark:border-yellow-800' : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}
                  >
                    <div className="relative">
                      <img src={member.avatar} alt={member.name} className="w-8 h-8 rounded-full object-cover" />
                      {idx === 0 && (
                        <Trophy className="absolute -top-1 -right-1 text-yellow-500" size={14} />
                      )}
                      {idx === 1 && (
                        <Medal className="absolute -top-1 -right-1 text-slate-400" size={14} />
                      )}
                      {idx === 2 && (
                        <Medal className="absolute -top-1 -right-1 text-amber-600" size={14} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 dark:text-white truncate">{member.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{member.actions} acciones</p>
                    </div>
                    <div 
                      className="w-3 h-3 rounded-full flex-shrink-0" 
                      style={{ backgroundColor: MEMBER_COLORS[idx % MEMBER_COLORS.length] }}
                    />
                  </div>
                ))}
            </div>

            {/* Bar Chart - Right Side */}
            <div className="flex-1 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={teamMembers
                    .map((member, idx) => ({
                      name: member.name.split(' ')[0],
                      acciones: logs.filter(log => log.user === member.name).length,
                      fill: MEMBER_COLORS[idx % MEMBER_COLORS.length]
                    }))
                    .sort((a, b) => b.acciones - a.acciones)
                  }
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" opacity={0.3} />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} width={60} />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: '#1e293b', color: '#fff' }}
                    formatter={(value: number) => [`${value} acciones`, 'Total']}
                  />
                  <Bar 
                    dataKey="acciones" 
                    radius={[0, 8, 8, 0]}
                    fill="#8b5cf6"
                  >
                    {teamMembers
                      .map((member, idx) => ({
                        acciones: logs.filter(log => log.user === member.name).length,
                        fill: MEMBER_COLORS[idx % MEMBER_COLORS.length]
                      }))
                      .sort((a, b) => b.acciones - a.acciones)
                      .map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={MEMBER_COLORS[index % MEMBER_COLORS.length]} />
                      ))
                    }
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Distribución</h3>
          <div className="h-48 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={assetDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {assetDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
              <span className="text-2xl font-bold text-slate-800 dark:text-white">85%</span>
              <span className="text-xs text-slate-400">Usado</span>
            </div>
          </div>
          <div className="mt-6 space-y-3">
            {assetDistribution.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                  <span className="text-sm text-slate-600 dark:text-slate-300">{item.name}</span>
                </div>
                <span className="text-sm font-semibold text-slate-800 dark:text-white">{item.value} archivos</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Actividad Reciente</h3>
        <div className="space-y-4">
          {logs.slice(0, 8).map((log) => (
            <div key={log.id} className="flex items-center space-x-4 pb-4 border-b border-slate-100 dark:border-slate-700 last:border-0 last:pb-0">
              <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-300 font-bold">
                {log.user.charAt(0)}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-800 dark:text-white">{log.action}</p>
                <p className="text-xs text-slate-500">{log.user}</p>
              </div>
              <span className="text-xs text-slate-400">{log.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};