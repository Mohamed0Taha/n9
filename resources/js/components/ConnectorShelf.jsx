export default function ConnectorShelf({ connectors }) {
    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex-1">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-semibold">Connector Library</h3>
                <span className="text-xs text-slate-500">{connectors.length} nodes</span>
            </div>
            <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                {connectors.map((connector) => (
                    <div key={connector.id} className="p-3 rounded-xl border border-slate-100 bg-slate-50 text-sm">
                        <p className="font-semibold">{connector.name}</p>
                        <p className="text-xs uppercase tracking-wide text-slate-500">{connector.category}</p>
                    </div>
                ))}
                {!connectors.length && <p className="text-sm text-slate-500">No connectors registered.</p>}
            </div>
        </div>
    );
}
