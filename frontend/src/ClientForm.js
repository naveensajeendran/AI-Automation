import React, { useState } from "react";
import { submitClientIntake } from "./api";

function ClientForm({ onClientAdded }) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        service_type: "",
        notes: "",
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await submitClientIntake(formData);
            alert("Client submitted successfully!");
            setFormData({ name: "", email: "", service_type: "", notes: "" });
            if (onClientAdded) onClientAdded(); // refresh clients list
        } catch (err) {
            console.error("Error submitting form:", err);
            alert("Failed to submit client.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>Name:</label>
            <input name="name" value={formData.name} onChange={handleChange} required disabled={loading} />

            <label>Email:</label>
            <input name="email" type="email" value={formData.email} onChange={handleChange} required disabled={loading} />

            <label>Service Type:</label>
            <input name="service_type" value={formData.service_type} onChange={handleChange} required disabled={loading} />

            <label>Notes:</label>
            <textarea name="notes" value={formData.notes} onChange={handleChange} disabled={loading} />

            <button type="submit" disabled={loading}>{loading ? "Submitting..." : "Submit"}</button>
        </form>
    );
}

export default ClientForm;
