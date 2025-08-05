function TransactionForm({
    form, setForm, onSubmit, editingId, onCancelEdit, error, success
}) {
    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    return (
        <form onSubmit={onSubmit} className="bg-white p-4 rounded shadow w-full max-w-xl mb-6 flex flex-col gap-2">
            <div className="flex gap-2">
                <select name="type" value={form.type} onChange={handleChange} className="border p-2 rounded flex-1">
                    <option value="in">Entrada</option>
                    <option value="out">Saída</option>
                </select>
                <input className="border p-2 rounded flex-1" name="value" type="number" step="1"
                    placeholder="Valor" value={form.value} onChange={handleChange} required />
            </div>
            <input className="border p-2 rounded" name="description" placeholder="Descrição"
                value={form.description} onChange={handleChange} required />
            <input className="border p-2 rounded" name="date" type="date"
                value={form.date} onChange={handleChange} required />

            {editingId && (
                <button type="button" className="bg-gray-300 text-gray-800 p-2 rounded hover:bg-gray-400 mb-2"
                    onClick={onCancelEdit}>
                    Cancelar edição
                </button>
            )}

            <button className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                {editingId ? "Salvar edição" : "Adicionar"}
            </button>
            {error && <div className="text-red-500">{error}</div>}
            {success && <div className="text-green-600">{success}</div>}
        </form>
    );
}

export default TransactionForm;
