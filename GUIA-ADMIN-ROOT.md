# 🔐 Guía del Usuario Admin-Root

## ✨ Sistema de Administración Implementado

Has solicitado un sistema de administrador y **está completamente funcional**. Aquí está todo lo que necesitas saber:

---

## 🎯 Credenciales Admin-Root

### **Usuario Administrador Principal:**
```
👤 Usuario: Admin Root
🔑 Contraseña: root2024
```

---

## 🏆 Permisos Exclusivos del Admin-Root

Como **Admin Root**, solo TÚ puedes:

### ✅ **Crear Nuevos Usuarios**
- Nombre completo
- Profesión/Rol (predefinidos + personalizado)
- URL de foto personalizada
- Contraseña de acceso

### ✅ **Editar Usuarios Existentes**
- Modificar nombre
- Cambiar rol/profesión
- Actualizar foto
- **Cambiar contraseña**

### ✅ **Eliminar Usuarios**
- Borrar usuarios que ya no sean necesarios
- (Admin Root no puede eliminarse a sí mismo)

### ✅ **Ver Contraseñas**
- Visualización de contraseñas de todos los usuarios
- Control total de accesos

---

## 📋 Cómo Usar el Sistema

### **1. Iniciar Sesión como Admin**

1. Ve a: http://localhost:3000
2. Usuario: `Admin Root`
3. Contraseña: `root2024`
4. Click en "Iniciar Sesión"

### **2. Ir a Gestión de Equipo**

1. Una vez dentro, click en **"Equipo"** en la barra lateral
2. Verás un badge amarillo: **"Modo Administrador Activo"**
3. Verás el botón **"Añadir Miembro"** (solo visible para admin)

### **3. Crear Nuevo Usuario**

#### Paso a paso:

1. **Click en "Añadir Miembro"** (botón violeta superior derecho)
2. Se abrirá un formulario con estos campos:

   **📝 Nombre Completo** (Requerido)
   - Ejemplo: "Carlos Rodríguez"
   
   **💼 Profesión / Rol** (Requerido)
   - Selecciona de la lista:
     - Diseñador
     - Desarrollador
     - Marketing Manager
     - Creative Director
     - Brand Strategist
     - Design Lead
     - Product Manager
     - UX Designer
     - Content Creator
     - Social Media Manager
     - **Otro (personalizado)** ← Si eliges esto, aparecerá un campo adicional
   
   **🎨 URL de Foto** (Opcional)
   - Pega una URL de imagen
   - Ejemplo: `https://example.com/photo.jpg`
   - Si lo dejas vacío, se genera automáticamente
   
   **🔒 Contraseña** (Requerido)
   - Mínimo 4 caracteres
   - Ejemplo: "usuario123"

3. **Click en "Crear Usuario"**

#### ✅ El nuevo usuario:
- Aparecerá en la lista de equipo
- Podrá iniciar sesión con sus credenciales
- **NO TENDRÁ** permisos de administrador
- Solo podrá ver el equipo, no modificarlo

### **4. Editar Usuario Existente**

1. **Hover sobre cualquier usuario** (excepto Admin Root)
2. Aparecerán botones en la esquina superior derecha:
   - 🟣 **Lápiz violeta** = Editar
   - 🔴 **Papelera roja** = Eliminar

3. **Click en el lápiz violeta**
4. Se abre el formulario con datos actuales pre-cargados
5. Modifica lo que necesites:
   - Nombre
   - Rol  
   - Foto
   - **Contraseña** (puedes cambiarla aquí)
6. Click en "Guardar Cambios"

### **5. Cambiar Contraseña de un Usuario**

Forma rápida:
1. Edita el usuario (paso anterior)
2. En el campo **"Contraseña"**, escribe la nueva
3. Guarda cambios

✅ **La contraseña se actualiza inmediatamente**

### **6. Eliminar Usuario**

1. Hover sobre el usuario a eliminar
2. Click en el botón de **papelera roja** 🔴
3. Confirma la eliminación
4. El usuario desaparece de la lista

⚠️ **Nota:** No puedes eliminar al Admin Root

---

## 👥 Usuarios Actuales en tu Sistema

### 🔐 Administrador:
```
Admin Root
- Rol: Super Administrator  
- Password: root2024
- PUEDE: Crear, editar, eliminar, cambiar passwords
```

### 👤 Usuarios Regulares:
```
John Makhowsky
- Rol: Design Lead
- Password: admin
- PUEDE: Ver equipo (no puede modificar)

Sarah Johnson
- Rol: Creative Director
- Password: admin
- PUEDE: Ver equipo (no puede modificar)

Mike Chen
- Rol: Brand Strategist
- Password: admin
- PUEDE: Ver equipo (no puede modificar)

Emma Davis
- Rol: Marketing Manager
- Password: admin
- PUEDE: Ver equipo (no puede modificar)
```

---

## 🎨 Características Visuales del Admin

### Badge de Administrador
- El Admin Root tiene una **corona dorada** 👑 en su tarjeta
- Border dorado alrededor de su foto
- Badge "ADMIN ROOT" arriba de la foto

### Modo Administrador Activo
- Banner amarillo/naranja en la parte superior
- Indica que tienes permisos especiales
- Solo visible para Admin Root

### Visualización de Contraseñas
- Solo el Admin puede ver las contraseñas
- Aparecen debajo del rol en cada tarjeta
- Formato: `🔑 contraseña`

### Botones de Acción
- Solo aparecen al hacer hover
- Solo en usuarios regulares (no en Admin Root)
- Violeta = Editar
- Rojo = Eliminar

---

## 🔄 Roles Predefinidos Disponibles

Cuando creas/editas usuarios, puedes elegir:

1. **Diseñador**
2. **Desarrollador**
3. **Marketing Manager**
4. **Creative Director**
5. **Brand Strategist**
6. **Design Lead**
7. **Product Manager**
8. **UX Designer**
9. **Content Creator**
10. **Social Media Manager**
11. **Otro (personalizado)** - Te permite escribir cualquier rol

---

## 💡 Casos de Uso Comunes

### Caso 1: Nuevo Empleado
```
1. Login como Admin Root
2. Ir a Equipo
3. Click "Añadir Miembro"
4. Llenar formulario
5. Crear usuario
6. Compartir credenciales con el empleado
```

### Caso 2: Cambio de Rol
```
1. Login como Admin Root
2. Ir a Equipo
3. Hover sobre usuario
4. Click editar (lápiz)
5. Cambiar rol
6. Guardar
```

### Caso 3: Reset de Contraseña
```
1. Login como Admin Root
2. Ir a Equipo
3. Hover sobre usuario
4. Click editar
5. Nueva contraseña en el campo
6. Guardar
7. Informar nueva password al usuario
```

### Caso 4: Empleado Sale de la Empresa
```
1. Login como Admin Root
2. Ir a Equipo
3. Hover sobre usuario
4. Click eliminar (papelera)
5. Confirmar
```

---

## 🔒 Seguridad

### ✅ Implementado:
- Solo Admin Root puede modificar usuarios
- Usuarios regulares solo pueden ver la lista
- Contraseñas solo visibles para admin
- Admin Root no puede eliminarse a sí mismo
- Confirmación antes de eliminar usuarios

### 🔐 Protección de Admin Root:
- Único usuario con `isAdmin: true` en la base de datos
- No puede ser editado desde la interfaz (botones ocultos)
- No puede ser eliminado

---

## 📊 Diferencias: Admin vs Usuario Regular

| Característica | Admin Root | Usuario Regular |
|----------------|------------|-----------------|
| **Ver equipo** | ✅ Sí | ✅ Sí |
| **Ver contraseñas** | ✅ Sí | ❌ No |
| **Añadir usuarios** | ✅ Sí | ❌ No |
| **Editar usuarios** | ✅ Sí | ❌ No |
| **Eliminar usuarios** | ✅ Sí | ❌ No |
| **Cambiar passwords** | ✅ Sí | ❌ No |
| **Badge especial** | 👑 Corona | 👤 Usuario |
| **Modo admin visible** | ✅ Sí | ❌ No |
| **Botón "Añadir Miembro"** | ✅ Visible | ❌ Oculto |

---

## 🎯 Verificación Visual

### Si eres Admin Root, verás:
1. ✅ Banner "Modo Administrador Activo" (amarillo/naranja)
2. ✅ Botón "Añadir Miembro" (violeta, arriba a la derecha)
3. ✅ Contraseñas visibles bajo cada rol
4. ✅ Botones de editar/eliminar al hacer hover
5. ✅ Badge "ADMIN ROOT" con corona en tu tarjeta
6. ✅ Footer dice: "Modo Administrador: Puedes crear, editar y eliminar usuarios"

### Si eres Usuario Regular, verás:
1. ❌ No hay banner de admin
2. ❌ No hay botón "Añadir Miembro"
3. ❌ No ves contraseñas
4. ❌ No hay botones de editar/eliminar
5. ✅ Solo badge de usuario normal
6. ✅ Footer dice: "Solo Admin Root puede gestionar usuarios"

---

## 🚀 Script de Mantenimiento

### Recrear Admin Root (si es necesario):

```bash
npx tsx create-admin-root.ts
```

Este script:
- ✅ Crea Admin Root si no existe
- ✅ Actualiza sus credenciales si ya existe
- ✅ Asegura que es el único admin
- ✅ Muestra lista de todos los usuarios

---

## 📝 Ejemplos Prácticos

### Ejemplo 1: Agregar Diseñador Freelance

**Formulario:**
```
Nombre: Ana Martínez
Rol: Diseñador (seleccionar de lista)
Foto: https://i.pravatar.cc/150?img=47
Contraseña: freelance2024
```

**Resultado:**
- Ana podrá iniciar sesión
- Verá todo el sistema (dashboard, proyectos, etc.)
- NO podrá modificar el equipo

### Ejemplo 2: Agregar Rol Personalizado

**Formulario:**
```
Nombre: Roberto Sánchez
Rol: Otro (personalizado)
  └─ Campo adicional: "Coordinador de Eventos"
Foto: (dejar vacío = se genera automática)
Contraseña: eventos123
```

**Resultado:**
- Roberto con rol "Coordinador de Eventos"
- Avatar generado automáticamente

### Ejemplo 3: Cambiar Contraseña Olvidada

**Usuario**: Mike Chen olvidó su contraseña

**Pasos:**
1. Login como Admin Root
2. Ir a Equipo
3. Hover sobre Mike Chen
4. Click lápiz (editar)
5. Campo contraseña: nueva-password-456
6. Guardar cambios
7. Avisar a Mike: "Tu nueva contraseña es: nueva-password-456"

---

## ✅ Checklist de Implementación

- [x] Campo `isAdmin` agregado a modelo User
- [x] Migración de base de datos aplicada
- [x] Usuario Admin Root creado
- [x] Interfaz de gestión completa
- [x] Crear usuarios con todos los campos
- [x] Editar usuarios existentes
- [x] Eliminar usuarios
- [x] Cambiar contraseñas
- [x] Roles predefinidos + personalizado
- [x] Fotos personalizadas
- [x] Protección de Admin Root
- [x] Vista diferenciada admin vs regular
- [x] Visualización de contraseñas (solo admin)

---

## 🎉 ¡Todo Implementado y Funcionando!

**✅ Tu sistema está completamente operativo**

Login ahora como **Admin Root** y prueba todas las funcionalidades:
1. Crea un usuario nuevo
2. Edita su rol
3. Cambia su contraseña
4. Visualiza la diferencia con un usuario regular

---

**Credenciales Admin:**
```
Usuario: Admin Root
Contraseña: root2024
URL: http://localhost:3000
```

**¡Listo para usar!** 🚀
