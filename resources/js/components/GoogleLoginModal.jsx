import { X } from 'lucide-react';

function GoogleLoginModal({ isOpen, onClose, reason }) {
    if (!isOpen) return null;

    const handleGoogleLogin = () => {
        // Redirect to Google OAuth
        window.location.href = '/auth/google';
    };

    const getMessage = () => {
        switch (reason) {
            case 'save_workflow':
                return 'Sign in to save your workflows permanently and get 100 free credits!';
            case 'add_credential':
                return 'Sign in to add API credentials securely and get 100 free credits!';
            case 'ai_generation':
                return 'Sign in to use AI workflow generation and get 100 free credits!';
            default:
                return 'Sign in to unlock all features and get 100 free credits!';
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
                    <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center border-4 border-black shadow-lg">
                        <span className="text-4xl">🔐</span>
                    </div>

                    {/* Title */}
                    <h2 className="text-3xl font-bold text-center mb-3 text-gray-800">
                        Sign In Required
                    </h2>

                    {/* Message */}
                    <p className="text-center text-gray-600 mb-6 text-lg leading-relaxed">
                        {getMessage()}
                    </p>

                    {/* Benefits */}
                    <div className="bg-yellow-50 border-3 border-yellow-400 rounded-lg p-4 mb-6">
                        <p className="font-bold text-yellow-800 mb-2">🎁 Welcome Bonus:</p>
                        <ul className="space-y-1 text-sm text-yellow-800">
                            <li>✨ 100 free credits</li>
                            <li>💾 Save unlimited workflows</li>
                            <li>🤖 Use AI generation</li>
                            <li>⚡ Schedule automated runs</li>
                        </ul>
                    </div>

                    {/* Google Sign-In Button */}
                    <button
                        onClick={handleGoogleLogin}
                        className="w-full bg-white border-3 border-black rounded-lg py-4 px-6 flex items-center justify-center gap-3 hover:bg-gray-50 shadow-lg transition-all hover:shadow-xl font-bold text-lg"
                        style={{ boxShadow: '4px 4px 0px #000' }}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        <span>Continue with Google</span>
                    </button>

                    {/* Cancel */}
                    <button
                        onClick={onClose}
                        className="w-full mt-3 text-gray-600 hover:text-gray-800 font-medium"
                    >
                        Maybe later
                    </button>
                </div>
            </div>
        </div>
    );
}

export default GoogleLoginModal;
