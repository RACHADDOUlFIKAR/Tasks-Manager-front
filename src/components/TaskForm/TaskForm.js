import React, { useState, useEffect } from 'react';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';

const TaskForm = ({ onTaskCreated, onTaskEdit, currentTask, setCurrentTask }) => {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('To_do');

    useEffect(() => {
        if (currentTask) {
            setOpen(true);
            setTitle(currentTask.title || '');
            setDescription(currentTask.description || '');
            setStatus(currentTask.status || 'To_do');
        } else {
            resetForm();
        }
    }, [currentTask]);

    const handleClickOpen = () => setOpen(true);

    const handleClose = () => {
        setOpen(false);
        resetForm();
        setCurrentTask(null);
    };

    const resetForm = () => {
        setTitle('');
        setDescription('');
        setStatus('To_do');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const taskData = {
            title: title.trim(),
            description: description.trim(),
            status,
            due_date: new Date().toISOString(),
        };

        try {
            if (currentTask && currentTask.id) {
                const response = await axios.put(`http://localhost:8000/api/tasks/${currentTask.id}/`, taskData);
                onTaskEdit(response.data); // envoie la tâche mise à jour
                toast.success('Tâche modifiée avec succès !');
            } else {
                const response = await axios.post('http://localhost:8000/api/tasks/', taskData);
                onTaskCreated(response.data);
                toast.success('Tâche crée avec succès !');
            }
            handleClose();
        } catch (error) {
            console.error('Erreur lors de la création ou de la modification de la tâche :', error);
            toast.error('Erreur de sauvegarde de la tâche. Veuillez réessayer.');
        }
    };

    return (
        <div>
          <Button
    className="professional-button" // Apply the CSS class
    variant="contained" // Keep the variant if needed
    color="primary" // You can remove this since it's being styled with CSS
    onClick={handleClickOpen}
>
    {currentTask ? 'Modifier une Tâche' : 'Ajouter une Tâche'}
</Button>

            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
                <DialogTitle>{currentTask ? 'Modifier une Tâche' : 'Ajouter une Tâche'}</DialogTitle>
                <DialogContent>
                    <form onSubmit={handleSubmit}>
                        <TextField 
                            autoFocus 
                            margin="dense" 
                            label="Titre" 
                            fullWidth 
                            value={title} 
                            onChange={(e) => setTitle(e.target.value)} 
                            required 
                        />
                        <TextField 
                            margin="dense" 
                            label="Description" 
                            fullWidth 
                            multiline 
                            rows={4} 
                            value={description} 
                            onChange={(e) => setDescription(e.target.value)} 
                            required 
                        />
                        <TextField 
                            select 
                            label="Statut" 
                            value={status} 
                            onChange={(e) => setStatus(e.target.value)} 
                            fullWidth 
                            SelectProps={{ native: true }}
                            margin="dense"
                        >
                            <option value="To_do">À faire</option>
                            <option value="In_Progress">En cours</option>
                            <option value="Done">Terminé</option>
                        </TextField>
                        <DialogActions>
                            <Button onClick={handleClose} color="secondary">Annuler</Button>
                            <Button type="submit" color="primary">{currentTask ? 'Modifier' : 'Ajouter'}</Button>
                        </DialogActions>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default TaskForm;
