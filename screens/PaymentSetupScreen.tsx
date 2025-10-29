

import React, { useState } from 'react';
import { BankIcon } from '../components/common/Icons';

interface PaymentSetupScreenProps {
  onComplete: () => void;
}

const PaymentSetupScreen: React.FC<PaymentSetupScreenProps> = ({ onComplete }) => {
  const [activeTab, setActiveTab] = useState<'bank' | 'upi'>('bank');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-900">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
                <BankIcon className="w-16 h-16 text-indigo-400" />
            </div>
            <p className="text-gray-400">Step 3 of 4</p>
            <h1 className="text-3xl font-bold text-white">Setup Your Payout Method</h1>
            <p className="text-gray-400 mt-2">This is how you'll receive your earnings.</p>
        </div>

        <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-2">
            <div className="flex bg-gray-900/50 rounded-lg p-1 mb-4">
                <button onClick={() => setActiveTab('bank')} className={`w-1/2 py-2 rounded-md font-semibold transition-colors ${activeTab === 'bank' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`}>
                    Bank Account
                </button>
                <button onClick={() => setActiveTab('upi')} className={`w-1/2 py-2 rounded-md font-semibold transition-colors ${activeTab === 'upi' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`}>
                    UPI
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 px-4 pb-4">
                {activeTab === 'bank' ? (
                    <>
                        <input type="text" placeholder="Account Holder Name" className="w-full bg-gray-700 border-gray-600 rounded-lg px-4 py-3" />
                        <input type="text" placeholder="Bank Account Number" className="w-full bg-gray-700 border-gray-600 rounded-lg px-4 py-3" />
                        <input type="text" placeholder="IFSC Code" className="w-full bg-gray-700 border-gray-600 rounded-lg px-4 py-3" />
                    </>
                ) : (
                    <input type="text" placeholder="yourname@bankupi" className="w-full bg-gray-700 border-gray-600 rounded-lg px-4 py-3" />
                )}
                 <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition-colors duration-200 mt-4">
                    Save and Continue
                </button>
            </form>
        </div>
      </div>
    </div>
  );
};

export default PaymentSetupScreen;