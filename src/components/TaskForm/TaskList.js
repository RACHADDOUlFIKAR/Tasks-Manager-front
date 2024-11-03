import React from 'react'; 
import { Button, Card, CardContent, Grid, ListItemText, Typography } from '@mui/material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const TaskList = ({ tasks, onTaskEdit, onTaskDelete, onUpdateTaskStatus }) => {
    const onDragEnd = (result) => {
        const { destination, source } = result;

        if (!destination) return; // Exit if dropped outside any droppable

        const taskId = tasks[source.index].id;
        const newStatus = destination.droppableId.split('-')[1];
        
        onUpdateTaskStatus(taskId, newStatus);
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Grid container spacing={2}>
                {/* Task List */}
                <Grid item xs={12} sm={8}>
                    <Droppable droppableId="taskList">
                        {(provided) => (
                            <div ref={provided.innerRef} {...provided.droppableProps} style={{ padding: '8px' }}>
                                <Grid container spacing={2}>
                                    {tasks.map((task, index) => (
                                        <Grid item xs={4} key={task.id}> {/* 3 cards per row */}
                                            <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                                                {(provided, snapshot) => (
                                                    <Card
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        style={{
                                                            ...provided.draggableProps.style,
                                                            height: '150px', // Keep square shape
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            justifyContent: 'space-between',
                                                            borderRadius: '8px',
                                                            backgroundColor: snapshot.isDragging ? '#e3f2fd' : '#ffffff',
                                                            boxShadow: snapshot.isDragging ? '0 6px 18px rgba(0, 0, 0, 0.2)' : '0 2px 8px rgba(0, 0, 0, 0.1)',
                                                            border: '1px solid #e0e0e0',
                                                        }}
                                                    >
                                                        <CardContent>
                                                            <Typography variant="body" style={{ fontWeight: 'bold', color: '#424242' }}>
                                                                {task.title}
                                                            </Typography>
                                                            <Typography variant="body2" color="textSecondary">
                                                                Status: {task.status}
                                                            </Typography>
                                                        </CardContent>
                                                        <div style={{
                                                            display: 'flex',
                                                            justifyContent: 'center', // Center the buttons horizontally
                                                            alignItems: 'center', 
                                                            padding: '8px',
                                                        }}>
                                                            <Button
                                                                variant="contained"
                                                                color="primary"
                                                                onClick={() => onTaskEdit(task)}
                                                                style={{
                                                                    textTransform: 'none',
                                                                    boxShadow: 'none',
                                                                    fontSize: '0.875rem',
                                                                    fontWeight: 'bold',
                                                                    marginRight: '8px', // Add spacing between buttons
                                                                }}
                                                            >
                                                                Edit
                                                            </Button>
                                                            <Button
                                                                variant="outlined"
                                                                color="secondary"
                                                                onClick={() => onTaskDelete(task.id)}
                                                                style={{
                                                                    textTransform: 'none',
                                                                    fontSize: '0.875rem',
                                                                    borderColor: '#f44336',
                                                                    color: '#f44336',
                                                                }}
                                                            >
                                                                Delete
                                                            </Button>
                                                        </div>
                                                    </Card>
                                                )}
                                            </Draggable>
                                        </Grid>
                                    ))}
                                    {provided.placeholder}
                                </Grid>
                            </div>
                        )}
                    </Droppable>
                </Grid>

                {/* Task Status Zones */}
                <Grid item xs={12} sm={4}>
                    <Grid container spacing={2}>
                        {['To_do', 'In_Progress', 'Done'].map((status) => {
                            let bgColor;
                            switch (status) {
                                case 'To_do':
                                    bgColor = '#e3f2fd'; 
                                    break;
                                case 'In_Progress':
                                    bgColor = '#bbdefb';
                                    break;
                                case 'Done':
                                    bgColor = '#b2dfdb'; 
                                    break;
                                default:
                                    bgColor = '#f5f5f5'; 
                            }

                            return (
                                <Grid item xs={12} key={status}>
                                    <Droppable droppableId={`zone-${status.toLowerCase()}`}>
                                        {(provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.droppableProps}
                                                style={{
                                                    padding: '16px',
                                                    backgroundColor: bgColor,
                                                    borderRadius: '8px',
                                                    border: '1px solid #ddd',
                                                    marginBottom: '8px',
                                                }}
                                            >
                                                <Typography variant="h6" style={{ color: '#616161' }}>{status.replace('_', ' ')}</Typography>
                                                <Grid container spacing={2}>
                                                    {tasks
                                                        .filter(task => task.status.toLowerCase() === status.toLowerCase())
                                                        .map((task, index) => (
                                                            <Grid item xs={4} key={task.id}> {/* 3 cards per row */}
                                                                <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                                                                    {(provided) => (
                                                                        <Card
                                                                            ref={provided.innerRef}
                                                                            {...provided.draggableProps}
                                                                            {...provided.dragHandleProps}
                                                                            style={{
                                                                                height: '150px', // Keep square shape
                                                                                display: 'flex',
                                                                                flexDirection: 'column',
                                                                                justifyContent: 'space-between',
                                                                                borderRadius: '4px',
                                                                                backgroundColor: '#ffffff',
                                                                                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
                                                                                border: '1px solid #e0e0e0',
                                                                            }}
                                                                        >
                                                                            <CardContent>
                                                                                <ListItemText
                                                                                    primary={<Typography variant="body1" style={{ fontWeight: 'bold', color: '#424242' }}>{task.title}</Typography>}
                                                                                    secondary={<Typography variant="body2" color="textSecondary">Status: {task.status}</Typography>}
                                                                                />
                                                                            </CardContent>
                                                                        </Card>
                                                                    )}
                                                                </Draggable>
                                                            </Grid>
                                                        ))}
                                                    {provided.placeholder}
                                                </Grid>
                                            </div>
                                        )}
                                    </Droppable>
                                </Grid>
                            );
                        })}
                    </Grid>
                </Grid>
            </Grid>
        </DragDropContext>
    );
};

export default TaskList;
