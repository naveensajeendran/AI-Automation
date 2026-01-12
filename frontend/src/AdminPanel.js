import React, { useState } from "react";
import { fetchClients } from "./api";

function AdminPanel() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loggedIn, setLoggedIn] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = () => {
        if (username === "gemra2025" && password === "naveenmidunan") {
            setLoggedIn(true);
            setError("");
        } else {
            setError("❌ Invalid credentials. Try again.");
        }
    };

    const handleDownload = async () => {
        setLoading(true);
        try {
            const data = await fetchClients(username, password);

            // Save as JSON file
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "clients.json";
            document.body.appendChild(link);
            link.click();
            link.remove();

        } catch (err) {
            alert("Error downloading file: " + err.message);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div
            style={{
                maxWidth: "450px",
                margin: "60px auto",
                padding: "30px",
                border: "1px solid #ddd",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                textAlign: "center",
                backgroundColor: "#fff",
            }}
        >
            <h2 style={{ marginBottom: "20px", color: "#007bff" }}>
                🔐 Gemra Ventures Admin
            </h2>

            {!loggedIn ? (
                <>
                    <input
                        type="text"
                        placeholder="Enter Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        style={{
                            padding: "12px",
                            width: "100%",
                            marginBottom: "15px",
                            border: "1px solid #ccc",
                            borderRadius: "8px",
                            fontSize: "16px"
                        }}
                    />
                    <input
                        type="password"
                        placeholder="Enter Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{
                            padding: "12px",
                            width: "100%",
                            marginBottom: "15px",
                            border: "1px solid #ccc",
                            borderRadius: "8px",
                            fontSize: "16px"
                        }}
                    />
                    <button
                        onClick={handleLogin}
                        style={{
                            padding: "12px 20px",
                            background: "#007bff",
                            color: "#fff",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer",
                            width: "100%",
                            fontSize: "16px"
                        }}
                    >
                        Login
                    </button>
                    {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
                </>
            ) : (
                <>
                    <p style={{ color: "green", fontWeight: "bold" }}>✅ Logged in as Admin</p>
                    <button
                        onClick={handleDownload}
                        disabled={loading}
                        style={{
                            padding: "12px 20px",
                            background: "green",
                            color: "#fff",
                            border: "none",
                            borderRadius: "8px",
                            cursor: loading ? "not-allowed" : "pointer",
                            marginTop: "15px",
                            width: "100%",
                            fontSize: "16px",
                            opacity: loading ? 0.6 : 1
                        }}
                    >
                        {loading ? "⏳ Downloading..." : "⬇ Download Clients JSON"}
                    </button>
                </>
            )}
        </div>
    );
}

export default AdminPanel;
