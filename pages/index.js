import TaskList from '../components/TaskList';

export default function Home() {
  return (
    <div className="bg-sportyfly-background min-h-screen text-center">
    <div className='text-center'>
      <h1 className="text-3xl font-semibold mb-4">Lista de Tareas</h1>
      <TaskList />
    </div>
  </div>
  
  );
}
