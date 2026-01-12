import React from "react";
import ClientForm from "./ClientForm";
import "./App.css";

function App() {
    return (
        <>
            <header>
                <h1>Gemra Ventures</h1>
                <nav>
                    <a href="/">🏠 Client Onboarding</a>
                    <a href="/admin">🔒 Admin</a>
                </nav>
            </header>

            <div className="container">
                <h2>Client Onboarding</h2>
                <ClientForm />
            </div>
        </>
    );
}

export default App;
