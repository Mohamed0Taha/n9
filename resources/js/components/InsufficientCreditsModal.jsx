import { X, CreditCard } from 'lucide-react';

function InsufficientCreditsModal({ isOpen, onClose, required, current, action }) {
    if (!isOpen) return null;

    const shortage = required - current;

    const getActionName = () => {
        switch (action) {
            case 'save_workflow': return 'save workflows';
            case 'ai_generation': return 'use AI generation';
            case 'workflow_execution': return 'execute workflows';
            case 'schedule_workflow': return 'schedule workflows';
            case 'add_credential': return 'add credentials';
            default: return 'use this feature';
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border-4 border-black relative"
                 style={{ fontFamily: "'Comic Neue', cursive" }}>
                
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="p-8">
                    {/* Icon */}
                    <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-red-400 to-red-600 rounded-2xl flex items-center justify-center border-4 border-black shadow-lg">
                        <span className="text-4xl">💳</span>
                    </div>

                    {/* Title */}
                    <h2 className="text-3xl font-bold text-center mb-3 text-gray-800">
                        Insufficient Credits
                    </h2>

                    {/* Message */}
                    <p className="text-center text-gray-600 mb-6 text-lg">
                        You need <strong className="text-red-600">{required} credits</strong> to {getActionName()}.
                    </p>

                    {/* Balance Info */}
                    <div className="bg-gray-50 border-3 border-gray-300 rounded-lg p-4 mb-6">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-600">Current Balance:</span>
                            <span className="font-bold text-2xl">{current} 💰</span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-600">Required:</span>
                            <span className="font-bold text-2xl text-red-600">{required} 💰</span>
                        </div>
                        <div className="border-t-2 border-gray-300 my-2"></div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600 font-bold">Shortage:</span>
                            <span className="font-bold text-2xl text-red-600">{shortage} 💰</span>
                        </div>
                    </div>

                    {/* Purchase Button */}
                    <button
                        onClick={() => {
                            // TODO: Navigate to purchase page
                            alert('Credit purchase coming soon!');
                        }}
                        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white border-3 border-black rounded-lg py-4 px-6 flex items-center justify-center gap-3 hover:from-blue-600 hover:to-blue-700 shadow-lg transition-all hover:shadow-xl font-bold text-lg"
                        style={{ boxShadow: '4px 4px 0px #000' }}
                    >
                        <CreditCard className="w-6 h-6" />
                        <span>Purchase Credits</span>
                    </button>

                    {/* Credit Packages */}
                    <div className="mt-4 text-center text-sm text-gray-600">
                        <p className="font-bold mb-2">Popular Packages:</p>
                        <div className="flex justify-center gap-2 flex-wrap">
                            <span className="bg-yellow-100 px-3 py-1 rounded-full border-2 border-yellow-400">
                                100 credits - $10
                            </span>
                            <span className="bg-yellow-100 px-3 py-1 rounded-full border-2 border-yellow-400">
                                500 credits - $45
                            </span>
                            <span className="bg-yellow-100 px-3 py-1 rounded-full border-2 border-yellow-400">
                                1000 credits - $80
                            </span>
                        </div>
                    </div>

                    {/* Close */}
                    <button
                        onClick={onClose}
                        className="w-full mt-4 text-gray-600 hover:text-gray-800 font-medium"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

export default InsufficientCreditsModal;
