import React, { useState } from 'react';
import { Quest } from '../types';
import { ArrowLeftIcon } from '../components/common/Icons';

interface QuestBiddingScreenProps {
  quest: Quest;
  onSubmit: (bidAmount: number, proposal: string) => void;
  onBack: () => void;
}

const QuestBiddingScreen: React.FC<QuestBiddingScreenProps> = ({ quest, onSubmit, onBack }) => {
    const [amount, setAmount] = useState('');
    const [proposal, setProposal] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = () => {
        const bidAmount = parseInt(amount, 10);
        if (isNaN(bidAmount) || bidAmount <= 0) {
            setError('Please enter a valid bid amount.');
            return;
        }
        if (proposal.trim().length < 20) {
            setError('Please write a proposal of at least 20 characters.');
            return;
        }
        setError('');
        onSubmit(bidAmount, proposal);
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-4">
            <div className="flex items-center mb-6">
                <button onClick={onBack} className="p-2 -ml-2"><ArrowLeftIcon className="w-6 h-6 text-purple-400"/></button>
                <h1 className="text-xl font-bold ml-2 truncate">Place Bid on: {quest.title}</h1>
            </div>
            
            <div className="w-full max-w-lg mx-auto">
                <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 space-y-6">
                    <div>
                        <label htmlFor="bidAmount" className="block text-sm font-medium text-gray-300 mb-2">Your Bid Amount (in ₹)</label>
                        <div className="relative">
                             <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">₹</span>
                            <input
                                id="bidAmount"
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder={`e.g., ${quest.budget ? quest.budget * 0.9 : 1000}`}
                                className="w-full bg-gray-700 border-gray-600 rounded-lg p-3 pl-7"
                            />
                        </div>
                         <p className="text-xs text-gray-500 mt-1">Client's budget is up to ₹{quest.budget?.toLocaleString()}</p>
                    </div>

                    <div>
                        <label htmlFor="proposal" className="block text-sm font-medium text-gray-300 mb-2">Your Proposal</label>
                        <textarea
                            id="proposal"
                            rows={6}
                            value={proposal}
                            onChange={(e) => setProposal(e.target.value)}
                            className="w-full bg-gray-700 border-gray-600 rounded-lg p-3"
                            placeholder="Tell the client why you're the best for this quest. Mention your relevant skills and experience."
                        ></textarea>
                    </div>

                    {error && <p className="text-red-400 text-sm text-center">{error}</p>}

                    <button
                        onClick={handleSubmit}
                        disabled={!amount || !proposal}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg transition-colors duration-200 disabled:bg-gray-700 disabled:cursor-not-allowed"
                    >
                        Submit Bid
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QuestBiddingScreen;