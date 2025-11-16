export default function WorkflowList({ workflows, selectedWorkflowId, onSelect }) {
    if (!workflows.length) {
        return <p className="p-6 text-slate-500 text-sm">No workflows yet. Use the AI prompt below to start.</p>;
    }

    return (
        <div>
            <div className="px-5 py-4 border-b border-slate-100">
                <h2 className="text-lg font-semibold">Workflows</h2>
                <p className="text-xs text-slate-500">AI drafts become editable flows here.</p>
            </div>
            <ul className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
                {workflows.map((workflow) => {
                    const active = workflow.id === selectedWorkflowId;
                    return (
                        <li
                            key={workflow.id}
                            className={`px-5 py-4 cursor-pointer ${active ? 'bg-slate-900 text-white' : 'hover:bg-slate-50'}`}
                            onClick={() => onSelect(workflow.id)}
                        >
                            <div className="flex items-center justify-between">
                                <p className="font-semibold">{workflow.name}</p>
                                <span className="text-xs uppercase tracking-wide">{workflow.status}</span>
                            </div>
                            <p className={`text-sm ${active ? 'text-slate-300' : 'text-slate-500'} mt-1`}>
                                {workflow.description}
                            </p>
                            <p className="text-xs mt-1">
                                {workflow.versions?.length ?? 0} versions ·{' '}
                                {workflow.runs?.length ? `${workflow.runs[0].status} last run` : 'No runs yet'}
                            </p>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
