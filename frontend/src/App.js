import React from "react";
import ClientForm from "./ClientForm";
import IntroPage from "./IntroPage";
import "./App.css";

function App() {
    return (
        <>
            <IntroPage />
            <div className="container">
                <h2>Client Onboarding</h2>
                <ClientForm />
            </div>
        </>
    );
}

export default App;
