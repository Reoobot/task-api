import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [taskId, setTaskId] = useState('');
  const [taskDate, setTaskDate] = useState('');
  const [taskTime, setTaskTime] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddingTask, setIsAddingTask] = useState(false);

  const fetchData = () => {
    axios.get('https://lydian-atlantic-clematis.glitch.me/getPostedData')
      .then(response => {
        setTasks(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addTask = () => {
    // Validación de campos antes de agregar la tarea
    if (!taskId || !newTask || !taskDate || !taskTime) {
      setIsAddingTask(true);
      return;
    }

    setIsAddingTask(false);
    const dueDateTime = taskDate + 'T' + taskTime + taskId;
    axios.post('https://lydian-atlantic-clematis.glitch.me/post', {
      id: taskId,
      title: newTask,
      date: dueDateTime,
    })
      .then(response => {
        setNewTask('');
        setTaskId('');
        setTaskDate('');
        setTaskTime('');
        fetchData();
      })
      .catch(error => {
        console.error(error);
      });
  };

  const editTask = (task) => {
    setEditingTask(task.id);
    setNewTask(task.title);
    setTaskId(task.id);
    const [dueDate, dueTime] = task.date.split('T');
    setTaskDate(dueDate);
    setTaskTime(dueTime);
  };

  const updateTask = () => {
    const dueDateTime = taskDate + 'T' + taskTime;
    axios.put(`https://lydian-atlantic-clematis.glitch.me/updatePostedData/${editingTask}`, {
      title: newTask,
      date: dueDateTime,
    })
      .then(response => {
        setNewTask('');
        setEditingTask(null);
        setTaskId('');
        setTaskDate('');
        setTaskTime('');
        fetchData();
      })
      .catch(error => {
        console.error(error);
      });
  };

  const deleteTask = (taskId) => {
    axios.delete(`https://lydian-atlantic-clematis.glitch.me/deletePostedData/${taskId}`)
      .then(() => {
        fetchData();
      })
      .catch(error => {
        console.error(error);
      });
  };

  useEffect(() => {
    const currentDateTime = new Date().toISOString();
    const tasksWithAlert = tasks.filter(task => task.date <= currentDateTime);
    if (tasksWithAlert.length > 0) {
      setIsModalOpen(true);
    }
  }, [tasks]);

  return (
    <div className="bg-sportyfly-background min-h-screen flex items-center justify-center p-6">
      <div className="w-full sm:w-auto card p-4 rounded shadow-lg">
        <div className="bg-white p-4 rounded">
          <input
            type="text"
            placeholder="ID"
            value={taskId}
            onChange={(e) => setTaskId(e.target.value)}
            className={`p-2 border border-gray-300 rounded mb-2 ${isAddingTask && !taskId ? 'border-red-500' : ''}`}
            required // Agrega la propiedad required
          />
          <input
            type="text"
            placeholder="Nueva tarea"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            className={`p-2 border border-gray-300 rounded mb-2 ${isAddingTask && !newTask ? 'border-red-500' : ''}`}
            required // Agrega la propiedad required
          />
          <input
            type="date"
            value={taskDate}
            onChange={(e) => setTaskDate(e.target.value)}
            className={`p-2 border border-gray-300 rounded mb-2 ${isAddingTask && !taskDate ? 'border-red-500' : ''}`}
            required // Agrega la propiedad required
          />
          <input
            type="time"
            value={taskTime}
            onChange={(e) => setTaskTime(e.target.value)}
            className={`p-2 border border-gray-300 rounded mb-2 ${isAddingTask && !taskTime ? 'border-red-500' : ''}`}
            required // Agrega la propiedad required
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
              <p className="text-xl text-white mb-2 sm:mb-0 sm:mr-4 sm:flex-1 overflow-wrap break-word text-center">
                {task.date}
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
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Tarea vencida"
        className="modal fixed inset-0 flex items-center justify-center z-50"
        overlayClassName="modal-overlay fixed inset-0 bg-black opacity-75"
      >
        <div className="modal-content bg-white rounded p-6">
          <h2 className="text-2xl font-bold text-sportyfly-primary mb-4">Tarea vencida</h2>
          <p className="text-base text-gray-700 mb-4">
            La tarea ha vencido. ¿Deseas más tiempo?
          </p>
          <div className="flex justify-end">
            <button
              className="bg-sportyfly-button text-white p-2 rounded hover-bg-sportyfly-button-dark"
              onClick={() => setIsModalOpen(false)}
            >
              Cerrar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
