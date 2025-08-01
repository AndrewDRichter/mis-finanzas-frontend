import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function Register() {
    const [form, setForm] = useState({ username: "", email: "", password: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        console.log(form)
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const response = await api.post("/users/register/", form);
            console.log(response)
            navigate("/login");
        } catch (err) {
            setError("Erro ao registrar. Tente outro usuário.");
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-amber-200">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow w-80 space-y-4">
                <h2 className="text-2xl font-bold mb-4 text-center">Registro</h2>
                <input className="w-full border p-2" name="username" placeholder="Usuário" onChange={handleChange} required />
                <input className="w-full border p-2" name="email" placeholder="Email" onChange={handleChange} required />
                <input className="w-full border p-2" name="password" type="password" placeholder="Senha" onChange={handleChange} required />
                {error && <div className="text-red-500">{error}</div>}
                <button className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Registrar</button>
            </form>
        </div>
    );
}

export default Register;
