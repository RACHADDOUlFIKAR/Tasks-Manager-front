const handleDelete = (taskId) => {
    const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer cette tâche ?");
    
    if (confirmDelete) {
        axios.delete(`http://localhost:8000/api/tasks/${taskId}/`)
            .then(() => {
                setTasks(tasks.filter(task => task.id !== taskId));
            })
            .catch(error => console.error('Error deleting task:', error));
    }
};
