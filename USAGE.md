# Uso del sistema de gestión de tareas

## Componentes principales

### 1. Formulario de tareas (`TaskForm`)

Permite crear nuevas tareas con:

- **Título** (obligatorio): se valida que no esté vacío; si se envía vacío se muestra "El título es obligatorio."
- **Descripción** (opcional)
- **Fecha de vencimiento** (opcional)
- **Estado**: Pendiente, En progreso, Completada

**Comportamiento:**

- Al enviar un formulario válido se llama `onSubmit` con los valores y el formulario se **limpia** (título, descripción, fecha y estado vuelven al valor inicial).
- El botón "Agregar tarea" envía el formulario.

**Ejemplo de uso:**

```tsx
import { TaskForm } from "@/components/TaskForm";

function MyPage() {
  const handleSubmit = (values) => {
    console.log(values);
    // { title, description, dueDate, status }
  };
  return <TaskForm onSubmit={handleSubmit} />;
}
```

### 2. Sistema de gestión de estados (lista + ítems)

- **TaskList**: muestra todas las tareas y delega en `TaskItem` cada una.
- **TaskItem**: muestra una tarea, un `<select>` para cambiar el estado y un botón "Eliminar".

**Interacción:**

- **Actualizar estado**: en cada tarea, el desplegable de estado llama `onUpdateStatus(id, nuevoStatus)`.
- **Eliminar**: el botón "Eliminar" llama `onDelete(id)`.
- La lista se actualiza según el estado que mantengas en la página (por ejemplo en `page.tsx`).

**Ejemplo de uso:**

```tsx
import { TaskList } from "@/components/TaskList";

const [tasks, setTasks] = useState([]);

const updateStatus = (id, status) => {
  setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
};
const deleteTask = (id) => {
  setTasks((prev) => prev.filter((t) => t.id !== id));
};

<TaskList tasks={tasks} onUpdateStatus={updateStatus} onDelete={deleteTask} />;
```

## Página principal (`app/page.tsx`)

- **Estado**: un array `tasks` con objetos `Task` (id, title, description, dueDate, status).
- **addTask**: añade una tarea con `generateId()` para un id único, y el resto de campos del formulario.
- **updateTask** / **updateStatus**: actualizan una tarea por `id` (p. ej. solo el estado).
- **deleteTask**: filtra y elimina la tarea por `id`.
- En la página se muestran el `TaskForm` (para agregar) y el `TaskList` (para ver, cambiar estado y eliminar).

## Utilidades (`lib/`)

- **generateId()**: devuelve un id único (timestamp + random) para nuevas tareas.
- **Tipos**: `Task`, `TaskStatus` exportados desde `@/lib`.
