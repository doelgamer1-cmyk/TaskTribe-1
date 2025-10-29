import React, { useState } from 'react';
import { IdCardIcon } from '../components/common/Icons';
import { generateVerificationTask, verifyPhotoTask } from '../services/geminiService';
import { PhotoVerificationTask } from '../types';
import Spinner from '../components/views/Spinner';
import CameraCapture from '../components/common/CameraCapture';

interface KYCVerificationScreenProps {
  onComplete: () => void;
}

type VerificationStep = 'idle' | 'generating' | 'task' | 'capturing' | 'verifying' | 'verified' | 'failed';

const KYCVerificationScreen: React.FC<KYCVerificationScreenProps> = ({ onComplete }) => {
    const [step, setStep] = useState<VerificationStep>('idle');
    const [task, setTask] = useState<PhotoVerificationTask | null>(null);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [verificationReason, setVerificationReason] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    const handleStartVerification = async () => {
        setStep('generating');
        setError(null);
        try {
            const verificationTask = await generateVerificationTask();
            setTask(verificationTask);
            setStep('task');
        } catch (err) {
            console.error(err);
            setError("Failed to generate a verification task. Please try again.");
            setStep('idle');
        }
    };

    const handleCapture = async (imageData: string) => {
        if (!task) return;
        setCapturedImage(imageData);
        setStep('verifying');
        setError(null);
        
        try {
            const result = await verifyPhotoTask(imageData, task.code);
            setVerificationReason(result.reason);
            if (result.isVerified) {
                setStep('verified');
                setTimeout(onComplete, 2000); // Auto-proceed on success
            } else {
                setStep('failed');
            }
        } catch (err) {
            console.error(err);
            setError("Failed to verify the photo. Please try again.");
            setStep('failed');
        }
    };

    const handleRetry = () => {
        setCapturedImage(null);
        setVerificationReason('');
        setError(null);
        setStep('task'); // Go back to the task instruction
    };

    const renderContent = () => {
        switch (step) {
            case 'idle':
            case 'generating':
                return (
                    <div className="text-center">
                        <p className="text-gray-400 mt-2 mb-8">We use live photo verification to prevent fraud and ensure platform safety. You will be asked to take a selfie holding a piece of paper with a code on it.</p>
                        <button onClick={handleStartVerification} disabled={step === 'generating'} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2">
                            {step === 'generating' ? <Spinner /> : 'Start Live Verification'}
                        </button>
                         {error && <p className="text-red-400 text-sm mt-4">{error}</p>}
                    </div>
                );
            case 'task':
                return (
                    <div className="text-center p-4 bg-gray-800 rounded-lg border border-gray-700">
                        <h3 className="text-lg font-bold text-white mb-2">Your Task:</h3>
                        <p className="text-indigo-300 font-mono text-2xl bg-gray-900 py-2 px-4 rounded-md my-4 inline-block">{task?.code}</p>
                        <p className="text-gray-300">{task?.instruction}</p>
                        <button onClick={() => setStep('capturing')} className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg">
                            Open Camera
                        </button>
                    </div>
                );
            case 'capturing':
                return <CameraCapture onCapture={handleCapture} onCancel={() => setStep('task')} />;

            case 'verifying':
                return (
                    <div className="text-center p-4 flex flex-col items-center">
                        <Spinner />
                        <p className="mt-4 font-semibold text-white">Verifying your photo...</p>
                        <p className="text-sm text-gray-400">Our AI is checking the image now.</p>
                        {capturedImage && <img src={`data:image/jpeg;base64,${capturedImage}`} alt="Verification capture" className="mt-4 rounded-lg max-w-xs mx-auto opacity-50" />}
                    </div>
                );
            
            case 'verified':
                return (
                    <div className="text-center p-4 text-green-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <h3 className="text-2xl font-bold text-white">Verification Successful!</h3>
                        <p>{verificationReason}</p>
                        <p className="mt-4 text-gray-400">Redirecting...</p>
                    </div>
                );
            
            case 'failed':
                return (
                    <div className="text-center p-4 text-red-400">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <h3 className="text-2xl font-bold text-white">Verification Failed</h3>
                        <p className="my-2">{error || verificationReason}</p>
                        <button onClick={handleRetry} className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg">
                            Try Again
                        </button>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-900">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <IdCardIcon className="w-16 h-16 text-indigo-400" />
                    </div>
                    <p className="text-gray-400">Step 2 of 4</p>
                    <h1 className="text-3xl font-bold text-white">Identity Verification (KYC)</h1>
                </div>

                <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default KYCVerificationScreen;