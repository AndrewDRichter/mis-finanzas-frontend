import { useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import BalanceBox from '../components/BalanceBox';
import TransactionForm from '../components/TransactionForm';
import TransactionTable from '../components/TransactionTable';

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
        // eslint-disable-next-line
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

    const handleCancelEdit = () => {
        setEditingId(null);
        setForm({ type: "entrada", value: "", description: "", date: "" });
    };

    return (
        <div className="flex flex-col items-center w-full min-h-screen p-8 bg-green-400">
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
            <BalanceBox balance={balance} />
            <TransactionForm
                form={form}
                setForm={setForm}
                onSubmit={handleSubmit}
                editingId={editingId}
                onCancelEdit={handleCancelEdit}
                error={error}
                success={success}
            />
            <TransactionTable
                transactions={transactions}
                onDelete={handleDelete}
                onEdit={handleEdit}
            />
        </div>
    );
}

export default Dashboard;
