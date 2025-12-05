# ⚡ Guía Rápida - BrandSync Workspace

## 🚀 Inicio en 30 Segundos

### 1️⃣ Abrir Terminales (2 ventanas)

**Terminal 1 - Backend:**
```bash
cd "/Users/mac/Downloads/brandsync-workspace (2)"
npm run server
```
✅ Espera ver: `Server running on http://localhost:3001`

**Terminal 2 - Frontend:**
```bash
cd "/Users/mac/Downloads/brandsync-workspace (2)"
npm run dev
```
✅ Espera ver: `Local: http://localhost:3000/`

### 2️⃣ Abrir Navegador

Ve a: **http://localhost:3000**

### 3️⃣ Iniciar Sesión

- **Usuario**: `John Makhowsky`
- **Contraseña**: `admin`

**Usuarios alternativos:**
- Sarah Johnson
- Mike Chen  
- Emma Davis

(Todos usan contraseña: `admin`)

---

## 🔄 Resetear Datos Demo

Si quieres volver a cargar los datos de demostración:

```bash
npx tsx seed-complete.ts
```

Luego **refresca el navegador** (F5)

---

## 📁 Archivos Importantes

```
RESUMEN-COMPLETO.md              → Documentación completa
COMPARACION-CLAUDE-VS-GEMINI.md  → Comparativa de IAs
seed-complete.ts                 → Script de datos demo
seed-demo-users.ts               → Script solo usuarios
.env                             → Configuración BD
```

---

## 🛠️ Comandos Útiles

### Ver Base de Datos
```bash
npx prisma studio
```
Abre en: http://localhost:5555

### Regenerar Prisma Client
```bash
npx prisma generate
```

### Nueva Migración (si cambias schema.prisma)
```bash
npx prisma migrate dev --name nombre
```

---

## 🎯 Páginas Disponibles

Después de login, puedes navegar a:

1. 🏠 **Resumen** - Dashboard principal
2. 💬 **Chat de Equipo** - Mensajes + IA
3. 📈 **Progreso** - Proyectos y tareas
4. 🖼️ **Recursos** - Assets multimedia
5. 🎨 **Kit de Marca** - Elementos de marca
6. 🤖 **IA Asistente** - Chat con Gemini
7. 👥 **Equipo** - Gestión de miembros
8. 📦 **Archivados** - Proyectos archivados

---

## ❗ Solución Rápida de Problemas

### ❌ "Cannot find module..."
```bash
npm install
```

### ❌ "Port 3000/3001 already in use"
Mata el proceso:
```bash
# Mac/Linux
lsof -ti:3000 | xargs kill
lsof -ti:3001 | xargs kill
```

### ❌ "PrismaClient error"
```bash
npx prisma generate
```

### ❌ "Database connection error"
Verifica que PostgreSQL esté corriendo y el `.env` sea correcto

### ❌ Login no funciona después de seed
Refresca la página (F5) para recargar los usuarios

---

## 📊 Datos Demo Incluidos

Después de `seed-complete.ts`:

- ✅ **4 usuarios** (con password "admin")
- ✅ **4 recursos** multimedia
- ✅ **3 elementos** de marca
- ✅ **2 proyectos** con etapas
- ✅ **4 logs** de actividad
- ✅ **3 mensajes** de chat

---

## 🎨 Cambiar Tema

Click en el botón de luna/sol en la esquina superior derecha

---

## 💡 Tips

1. **Hot Reload**: Los cambios en código se reflejan automáticamente
2. **Tema Persistente**: El tema se guarda en localStorage
3. **Navegación**: Usa la barra lateral para cambiar de página
4. **Proyectos → Secciones**: Convierte proyectos en espacios de trabajo

---

## 🆘 ¿Necesitas Ayuda?

Lee los documentos completos:
- `RESUMEN-COMPLETO.md` - Todo lo que necesitas saber
- `COMPARACION-CLAUDE-VS-GEMINI.md` - Qué hice diferente

---

## ✅ Checklist de Inicio

- [ ] PostgreSQL corriendo
- [ ] `npm install` ejecutado
- [ ] `.env` configurado
- [ ] `npx prisma generate` ejecutado  
- [ ] `npx tsx seed-complete.ts` ejecutado
- [ ] Backend corriendo (port 3001)
- [ ] Frontend corriendo (port 3000)
- [ ] Navegador en http://localhost:3000
- [ ] Login exitoso

---

**¡Listo! 🎉 Ahora tienes BrandSync completamente funcional.**

*¿Todo funciona? ✅*
*¿Algún problema? Lee RESUMEN-COMPLETO.md 📚*
