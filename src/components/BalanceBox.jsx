
function BalanceBox({ balance }) {
    return (
        <div className="text-xl font-semibold mb-4">
            Saldo: <span className={balance >= 0 ? "text-green-600" : "text-red-600"} >
                PYG {balance.toFixed(2)}
            </span>
        </div>
    )
}

export default BalanceBox;