import React, { useState } from 'react';

const Feedback = () => {
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState('idle'); // idle, sending, success, error

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        setStatus('sending');

        try {
            const response = await fetch("https://formsubmit.co/ajax/1097849093@qq.com", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    message: message,
                    _subject: "Guitar App Feedback"
                })
            });

            if (!response.ok) throw new Error('Failed to send');

            setStatus('success');
            setMessage('');
            setTimeout(() => setStatus('idle'), 3000); // Reset after 3 seconds
        } catch (error) {
            console.error(error);
            setStatus('error');
        }
    };

    return (
        <div className="w-full max-w-[800px] mx-auto mt-12 mb-8 px-4 animate-fade-in-up [animation-delay:400ms]">
            <div className="bg-secondary-bg/90 rounded-3xl p-6 border border-tertiary-bg shadow-lg">
                <h3 className="text-xl font-bold text-accent mb-4">Feedback & Suggestions</h3>

                {status === 'success' ? (
                    <div className="bg-green-500/10 border border-green-500/20 text-green-500 p-4 rounded-xl text-center font-bold">
                        Thank you for your feedback! It has been sent.
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <textarea
                            className="w-full bg-tertiary-bg/50 text-text-main border border-tertiary-bg rounded-2xl p-4 focus:outline-none focus:border-accent resize-none h-32 transition-colors placeholder:text-text-muted"
                            placeholder="Tell us what you think or how we can improve..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            disabled={status === 'sending'}
                            required
                        />

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={status === 'sending' || !message.trim()}
                                className={`
                  px-6 py-2 rounded-xl text-sm font-bold uppercase tracking-wider transition-all
                  ${status === 'sending' || !message.trim()
                                        ? 'bg-tertiary-bg text-text-muted cursor-not-allowed'
                                        : 'bg-accent text-white hover:bg-accent/90 shadow-lg shadow-accent/20 active:scale-95'}
                `}
                            >
                                {status === 'sending' ? 'Sending...' : 'Submit Feedback'}
                            </button>
                        </div>

                        {status === 'error' && (
                            <p className="text-red-500 text-xs text-center">
                                Something went wrong. Please try again later.
                            </p>
                        )}

                        <p className="text-xs text-text-muted text-center opacity-70">
                            Your feedback helps us improve.
                        </p>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Feedback;
