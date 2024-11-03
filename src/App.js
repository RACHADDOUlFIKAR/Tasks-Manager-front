import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TaskForm from './components/TaskForm/TaskForm';
import TaskList from './components/TaskForm/TaskList';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
    const [tasks, setTasks] = useState([]);
    const [currentTask, setCurrentTask] = useState(null);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/tasks/');
            setTasks(response.data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
            toast.error('Erreur lors de la récupération des tâches.');
        }
    };

    const handleTaskCreated = (newTask) => {
        setTasks((prevTasks) => [...prevTasks, newTask]);
    };

    const handleTaskEdit = (updatedTask) => {
        setTasks((prevTasks) =>
            prevTasks.map(task => (task.id === updatedTask.id ? updatedTask : task))
        );
        setCurrentTask(null);
    };

    const handleTaskDelete = async (taskId) => {
        const confirmed = window.confirm("Êtes-vous sûr de vouloir supprimer cette tâche ?");
        if (!confirmed) {
            return; 
        }
    
        try {
            await axios.delete(`http://localhost:8000/api/tasks/${taskId}/`);
            setTasks((prevTasks) => prevTasks.filter(task => task.id !== taskId));
            toast.success('Tâche supprimée avec succès !');
        } catch (error) {
            console.error('Error deleting task:', error);
            toast.error('Erreur lors de la suppression de la tâche.');
        }
    };
    

    const handleUpdateTaskStatus = async (taskId, status) => {
        const statusMap = {
            'to_do': 'To_do',
            'in_progress': 'In_Progress',
            'done': 'Done'
        };
    
        const mappedStatus = statusMap[status.toLowerCase()] || status;
    
        try {
            const response = await axios.patch(`http://localhost:8000/api/tasks/${taskId}/`, { status: mappedStatus });
            setTasks((prevTasks) =>
                prevTasks.map(task => (task.id === taskId ? response.data : task))
            );
            fetchTasks();
        } catch (error) {
            console.error('Error updating task status:', error.response ? error.response.data : error.message);
            toast.error('Erreur lors de la mise à jour du statut de la tâche.');
        }
    };

    return (
        <div>
            <TaskForm 
                onTaskCreated={handleTaskCreated} 
                onTaskEdit={handleTaskEdit} 
                currentTask={currentTask} 
                setCurrentTask={setCurrentTask} 
            />
            <TaskList 
                tasks={tasks} 
                onTaskEdit={(task) => setCurrentTask(task)} 
                onTaskDelete={handleTaskDelete} 
                onUpdateTaskStatus={handleUpdateTaskStatus} 
            />
            <ToastContainer 
                position="top-right" 
                autoClose={5000} 
                hideProgressBar={false} 
                closeOnClick 
                pauseOnHover 
                draggable 
                pauseOnFocusLoss 
            />
        </div>
    );
};

export default App;
