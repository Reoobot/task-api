import { useState, useEffect } from 'react';
import axios from 'axios';

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [taskId, setTaskId] = useState('');

  const fetchData = () => {
    axios.get('https://uttermost-prairie-chill.glitch.me/getPostedData')
      .then(response => {
        setTasks(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  };

  useEffect(() => {
    fetchData(); // Realiza una solicitud GET al cargar la página
  }, []);

  const addTask = () => {
    axios.post('https://uttermost-prairie-chill.glitch.me/post', {
      id: taskId,
      title: newTask
    })
      .then(response => {
        setNewTask('');
        setTaskId('');
        fetchData(); // Realiza una solicitud GET después de crear
      })
      .catch(error => {
        console.error(error);
      });
  };

  const editTask = (task) => {
    setEditingTask(task.id);
    setNewTask(task.title);
    setTaskId(task.id);
  };

  const updateTask = () => {
    axios.put(`https://uttermost-prairie-chill.glitch.me/updatePostedData/${editingTask}`, {
      title: newTask
    })
      .then(response => {
        setNewTask('');
        setEditingTask(null);
        setTaskId('');
        fetchData(); // Realiza una solicitud GET después de actualizar
      })
      .catch(error => {
        console.error(error);
      });
  };

  const deleteTask = (taskId) => {
    axios.delete(`https://uttermost-prairie-chill.glitch.me/deletePostedData/${taskId}`)
      .then(() => {
        fetchData(); // Realiza una solicitud GET después de eliminar
      })
      .catch(error => {
        console.error(error);
      });
  };

  return (
    <div className="bg-sportyfly-background min-h-screen flex items-center justify-center p-6">
    <div className="w-full sm:w-auto card p-4 rounded shadow-lg">
      <div className="bg-white p-4 rounded">
        <input
          type="text"
          placeholder="ID"
          value={taskId}
          onChange={(e) => setTaskId(e.target.value)}
          className="p-2 border border-gray-300 rounded mb-2"
        />
        <input
          type="text"
          placeholder="Nueva tarea"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="p-2 border border-gray-300 rounded mb-2"
        />
        {editingTask ? (
          <button onClick={updateTask} className="bg-sportyfly-button text-white p-2 rounded">
            Actualizar Tarea
          </button>
        ) : (
          <button onClick={addTask} className="bg-sportyfly-button text-white p-2 rounded">
            Agregar Tarea
          </button>
        )}
      </div>
      <ul className="mt-4 text-center">
        {tasks.map(task => (
          <li key={task.id} className="mb-2 border rounded p-4 flex flex-col sm:flex-row items-center">
            <p className="text-xl text-white mb-2 sm:mb-0 sm:mr-4 sm:flex-1 overflow-wrap break-word text-center">
              {task.title}
            </p>
            <div className="flex">
              <button onClick={() => editTask(task)} className="bg-sportyfly-button text-white p-2 rounded">
                Editar
              </button>
              <button onClick={() => deleteTask(task.id)} className="bg-sportyfly-button text-white p-2 rounded ml-2">
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  </div>
  
  );
}
