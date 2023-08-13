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
            console.log("newTodo => ", newTodo);
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
            <div class="py-8 px-8 max-w-sm mx-auto bg-white rounded-xl shadow-lg space-y-2 sm:py-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-6">
                <img class="block mx-auto h-24 rounded-full sm:mx-0 sm:shrink-0" src="/img/erin-lindford.jpg" alt="User Profile Picture" />
                <div class="text-center space-y-2 sm:text-left">
                    <div class="space-y-0.5">
                        <p class="text-lg text-black font-semibold">
                            {userData?.username}
                        </p>
                        <p class="text-slate-500 font-medium">
                            Role :- Not Available
                        </p>
                    </div>
                    {/* <button class="px-4 py-1 text-sm text-purple-600 font-semibold rounded-full border border-purple-200 hover:text-white hover:bg-purple-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2">Message</button> */}
                </div>
            </div>
            <h1 className="text-3xl font-bold underline">ToDo List</h1>
            <table>
                <tbody>
                    {todos.map(todo => (
                        <tr key={todo._id} class="odd:bg-white even:bg-slate-50">
                            <td><input type="checkbox" checked={todo.completed} /></td>
                            <td>{todo.title}</td>
                            <td><button onClick={() => handleUpdateTodo(todo._id, { title: 'Updated Title' })}>Update</button></td>
                            <td><button onClick={() => handleDeleteTodo(todo._id)}>Delete</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>

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
