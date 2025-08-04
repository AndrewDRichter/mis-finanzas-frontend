import { useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';


function Dashboard() {
    const [transactions, setTransactions] = useState([]);
    const [balance, setBalance] = useState(0);
    const [form, setForm] = useState({
        type: "in",
        value: "",
        description: "",
        date: "",
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [editingId, setEditingId] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("access");
        if (!token) {
            navigate('/login')
            return;
        }

        fetchTransactions();
        fetchBalance();
    }, [navigate])

    async function fetchTransactions() {
        try {
            const res = await api.get("/transactions/");
            setTransactions(res.data);
        } catch (err) {
            setError("Erro ao carregar transações.");
            if (err.response && err.response.status === 401) {
                localStorage.removeItem("access");
                localStorage.removeItem("refresh");
                navigate("/login");
            }
        }
    }

    async function fetchBalance() {
        try {
            const res = await api.get("/transactions/balance/");
            setBalance(res.data.balance);
        } catch (err) {
            setError("Erro ao carregar saldo.");
        }
    }


    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        if (!form.value || !form.description || !form.date) {
            setError("Preencha todos os campos!");
            return;
        }
        try {
            if (editingId) {
                // Edição
                await api.put(`/transactions/${editingId}/`, {
                    ...form,
                    value: parseFloat(form.value),
                });
                setSuccess("Transação editada com sucesso!");
                setEditingId(null);
            } else {
                // Criação
                await api.post("/transactions/", {
                    ...form,
                    value: parseFloat(form.value),
                });
                setSuccess("Transação registrada com sucesso!");
            }
            setForm({ type: "in", value: "", description: "", date: "" });
            fetchTransactions();
            fetchBalance();
        } catch (err) {
            setError(editingId ? "Erro ao editar transação." : "Erro ao registrar transação.");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Tem certeza que deseja excluir esta transação?")) return;
        try {
            await api.delete(`/transactions/${id}/`);
            setSuccess("Transação excluída com sucesso!");
            fetchTransactions();
            fetchBalance();
        } catch (err) {
            setError("Erro ao excluir transação.");
        }
    };

    const handleEdit = (tx) => {
        setForm({
            type: tx.type,
            value: tx.value,
            description: tx.description,
            date: tx.date,
        });
        setEditingId(tx.id);
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Sobe para o formulário
    };


    return (
        <div className="flex flex-col items-center min-h-screen p-8 bg-gray-50">
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
            <div className="text-xl font-semibold mb-4">
                Saldo Atual: <span className={balance >= 0 ? "text-green-600" : "text-red-600"}>PYG {balance.toFixed(2)}</span>
            </div>
            <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow w-full max-w-xl mb-6 flex flex-col gap-2">
                <div className="flex gap-2">
                    <select
                        name="type"
                        value={form.type}
                        onChange={handleChange}
                        className="border p-2 rounded flex-1"
                    >
                        <option value="in">Entrada</option>
                        <option value="out">Salida</option>
                    </select>
                    <input
                        className="border p-2 rounded flex-1"
                        name="value"
                        type="number"
                        step="0.01"
                        placeholder="Valor"
                        value={form.value}
                        onChange={handleChange}
                        required
                    />
                </div>
                <input
                    className="border p-2 rounded"
                    name="description"
                    placeholder="Descripción"
                    value={form.description}
                    onChange={handleChange}
                    required
                />
                <input
                    className="border p-2 rounded"
                    name="date"
                    type="date"
                    value={form.date}
                    onChange={handleChange}
                    required
                />
                {editingId && (
                    <button
                        type="button"
                        className="bg-gray-300 text-gray-800 p-2 rounded hover:bg-gray-400 mb-2"
                        onClick={() => {
                            setEditingId(null);
                            setForm({ type: "in", value: "", description: "", date: "" });
                        }}
                    >
                        Cancelar edição
                    </button>
                )}
                <button className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                    {editingId ? "Salvar edição" : "Adicionar"}
                </button>

                {error && <div className="text-red-500">{error}</div>}
                {success && <div className="text-green-600">{success}</div>}
            </form>
            <table className="w-full max-w-xl bg-white rounded shadow">
                <thead>
                    <tr>
                        <th className="p-2">Tipo</th>
                        <th className="p-2">Valor</th>
                        <th className="p-2">Descripción</th>
                        <th className="p-2">Data</th>
                        <th className="p-2">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((tx) => (
                        <tr key={tx.id}>
                            <td className="p-2">{tx.type}</td>
                            <td className="p-2">{tx.value}</td>
                            <td className="p-2">{tx.description}</td>
                            <td className="p-2">{tx.date}</td>
                            <td className="p-2">
                                <button
                                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700 mr-2"
                                    onClick={() => handleDelete(tx.id)}
                                >
                                    Excluir
                                </button>
                                <button
                                    className="bg-yellow-400 text-white px-2 py-1 rounded hover:bg-yellow-500"
                                    onClick={() => handleEdit(tx)}
                                >
                                    Editar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Dashboard;
