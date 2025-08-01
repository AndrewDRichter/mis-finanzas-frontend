import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function Login() {
    const [form, setForm] = useState({ username: "", password: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const res = await api.post("/users/login/", form);
            localStorage.setItem("access", res.data.access);
            localStorage.setItem("refresh", res.data.refresh);
            navigate("/dashboard");
        } catch (err) {
            setError("Usuário ou senha inválidos.");
        }
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow w-80 space-y-4">
                <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
                <input className="w-full border p-2" name="username" placeholder="Usuário" onChange={handleChange} required />
                <input className="w-full border p-2" name="password" type="password" placeholder="Senha" onChange={handleChange} required />
                {error && <div className="text-red-500">{error}</div>}
                <button className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600">Entrar</button>
            </form>
        </div>
    );
}

export default Login;
