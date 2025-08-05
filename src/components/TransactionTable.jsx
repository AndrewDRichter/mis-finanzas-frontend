function TransactionTable({ transactions, onDelete, onEdit }) {
    return (
        <table className="w-full max-w-5xl bg-white rounded shadow">
            <thead>
                <tr>
                    <th className="p-2">Tipo</th>
                    <th className="p-2">Valor</th>
                    <th className="p-2">Descrição</th>
                    <th className="p-2">Data</th>
                    <th className="p-2">Ações</th>
                </tr>
            </thead>
            <tbody>
                {transactions.map((tx) => (
                    <tr key={tx.id}>
                        <td className={tx.type === 'in' ? 'p-2 font-bold text-green-600' : 'p-2 font-bold text-red-600'}>{tx.type === 'in' ? 'Entrada' : 'Salida'}</td>
                        <td className="p-2">{tx.value}</td>
                        <td className="p-2">{tx.description}</td>
                        <td className="p-2">{tx.date}</td>
                        <td className="p-2">
                            <button className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700 mr-2"
                                onClick={() => onDelete(tx.id)}>Excluir</button>
                            <button className="bg-yellow-400 text-white px-2 py-1 rounded hover:bg-yellow-500"
                                onClick={() => onEdit(tx)}>Editar</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default TransactionTable;
