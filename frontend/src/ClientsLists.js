import React, { useEffect, useState } from "react";

function ClientsList() {
    const [clients, setClients] = useState([]);

    useEffect(() => {
        fetch("http://127.0.0.1:8000/clients")
            .then((res) => res.json())
            .then((data) => setClients(data))
            .catch((err) => console.error("Error fetching clients:", err));
    }, []);

    return (
        <div className="client-list">
            <h2>Client List</h2>
            {clients.length === 0 ? (
                <p>No clients yet.</p>
            ) : (
                <ul>
                    {clients.map((client, index) => (
                        <li key={index}>
                            <strong>{client.name}</strong> ({client.email}) <br />
                            Service: {client.service_type} <br />
                            Notes: {client.notes}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default ClientsList;
