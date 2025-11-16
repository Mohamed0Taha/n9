export default function RunHistoryDrawer({ runs }) {
    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex-1">
            <h3 className="text-base font-semibold mb-2">Recent Runs</h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
                {runs?.length ? (
                    runs.map((run) => (
                        <div
                            key={run.id}
                            className="p-3 rounded-xl border border-slate-100 bg-slate-50 text-sm text-slate-700"
                        >
                            <div className="flex items-center justify-between">
                                <p className="font-semibold capitalize">{run.status}</p>
                                <span className="text-xs text-slate-500">
                                    {run.started_at ? new Date(run.started_at).toLocaleString() : ''}
                                </span>
                            </div>
                            <p className="text-xs text-slate-500">
                                {run.finished_at ? `Completed ${new Date(run.finished_at).toLocaleTimeString()}` : 'In progress'}
                            </p>
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-slate-500">No runs yet.</p>
                )}
            </div>
        </div>
    );
}
