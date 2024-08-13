import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App: React.FC = () => {
    const [items, setItems] = useState<any[]>([]);
    const [name, setName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [editingItem, setEditingItem] = useState<number | null>(null);

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        const response = await axios.get('http://localhost:8080/api/items');
        setItems(response.data);
    };

    const addItem = async () => {
        const response = await axios.post('http://localhost:8080/api/items', { name, description });
        setItems([...items, response.data]);
        clearForm();
    };

    const deleteItem = async (id: number) => {
        await axios.delete(`http://localhost:8080/api/items/${id}`);
        setItems(items.filter(item => item.id !== id));
    };

    const editItem = (item: any) => {
        setEditingItem(item.id);
        setName(item.name);
        setDescription(item.description);
    };

    const updateItem = async () => {
        const response = await axios.put(`http://localhost:8080/api/items/${editingItem}`, { name, description });
        setItems(items.map(item => (item.id === editingItem ? response.data : item)));
        clearForm();
    };

    const clearForm = () => {
        setName('');
        setDescription('');
        setEditingItem(null);
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Item List</h1>
            <ul className="list-group mb-4">
                {items.map(item => (
                    <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                            <strong>{item.name}</strong> - {item.description}
                        </div>
                        <div>
                            <button onClick={() => editItem(item)} className="btn btn-warning btn-sm mr-2">Edit</button>
                            <button onClick={() => deleteItem(item.id)} className="btn btn-danger btn-sm">Delete</button>
                        </div>
                    </li>
                ))}
            </ul>
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">{editingItem ? 'Edit Item' : 'Add Item'}</h5>
                    <div className="form-group">
                        <input
                            type="text"
                            className="form-control mb-2"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="Name"
                        />
                        <input
                            type="text"
                            className="form-control mb-2"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            placeholder="Description"
                        />
                        <div className="text-right">
                            <button onClick={editingItem ? updateItem : addItem} className="btn btn-primary">
                                {editingItem ? 'Update' : 'Add'}
                            </button>
                            {editingItem && (
                                <button onClick={clearForm} className="btn btn-secondary ml-2">Cancel</button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default App;
