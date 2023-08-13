import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
    const location = useLocation();
    const userData = location.state?.userData;
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState({ title: '', description: '', completed: false });

    const handleAddTodo = async () => {
        try {
            console.log("newTodo => " , newTodo);
            // Send a POST request to add a new ToDo
            const res = await axios.post('http://localhost:5000/api/todos', {
                title: newTodo.title,
                description: newTodo.description,
                completed: newTodo.completed,
                username: userData.username
            });
            // Fetch updated ToDo list
            const response = await axios.get(`http://localhost:5000/api/todos/${userData.username}`);
            setTodos(response.data);
        } catch (error) {
            console.error('Error adding ToDo:', error);
        }
    };

    const handleUpdateTodo = async (id, updatedData) => {
        try {
            // Send a PUT request to update a ToDo
            await axios.put(`/api/todos/${userData.username}/${id}`, updatedData);

            // Fetch updated ToDo list
            const response = await axios.get(`/api/todos/${userData.username}`);
            setTodos(response.data);
        } catch (error) {
            console.error('Error updating ToDo:', error);
        }
    };

    const handleDeleteTodo = async (id) => {
        try {
            // Send a DELETE request to delete a ToDo
            await axios.delete(`/api/todos/${userData.username}/${id}`);

            // Fetch updated ToDo list
            const response = await axios.get(`/api/todos/${userData.username}`);
            setTodos(response.data);
        } catch (error) {
            console.error('Error deleting ToDo:', error);
        }
    };

    useEffect(() => {
        // Fetch ToDo items for the user
        const fetchTodos = async () => {
            try {
                const response = await axios.get(`/api/todos/${userData?.username}`);
                setTodos(response.data);
            } catch (error) {
                console.error('Error fetching Todos:', error);
            }
        };
        fetchTodos();
    }, [userData]);

    return (
        <div>
            <h1>ToDo List</h1>
            <ul>
                {todos.map(todo => (
                    <li key={todo._id}>
                        <input type="checkbox" checked={todo.completed} />
                        <span>{todo.title}</span>
                        <button onClick={() => handleUpdateTodo(todo._id, { title: 'Updated Title' })}>Update</button>
                        <button onClick={() => handleDeleteTodo(todo._id)}>Delete</button>
                    </li>
                ))}
            </ul>
            
            {/* Form for adding a new ToDo */}
            <div>
                <h2>Add New ToDo</h2>
                <input
                    type="text"
                    placeholder="Title"
                    value={newTodo.title}
                    onChange={e => setNewTodo({ ...newTodo, title: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Description"
                    value={newTodo.description}
                    onChange={e => setNewTodo({ ...newTodo, description: e.target.value })}
                />
                <button onClick={handleAddTodo}>Add ToDo</button>
            </div>
        </div>
    );
};

export default Dashboard;
