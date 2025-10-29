import React, { useState, useEffect } from 'react';
import { ShieldIcon } from '../components/common/Icons';
import { generateQuestVerificationTask, verifyQuestCompletionPhoto } from '../services/geminiService';
import { PhotoVerificationTask, Quest } from '../types';
import Spinner from '../components/views/Spinner';
import CameraCapture from '../components/common/CameraCapture';

interface QuestVerificationScreenProps {
  quest: Quest;
  onComplete: () => void;
  onBack: () => void; // To go back to active task if they cancel
}

type VerificationStep = 'generating' | 'task' | 'capturing' | 'verifying' | 'verified' | 'failed';

const QuestVerificationScreen: React.FC<QuestVerificationScreenProps> = ({ quest, onComplete, onBack }) => {
    const [step, setStep] = useState<VerificationStep>('generating');
    const [task, setTask] = useState<PhotoVerificationTask | null>(null);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [verificationReason, setVerificationReason] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const getTask = async () => {
            setError(null);
            try {
                const verificationTask = await generateQuestVerificationTask(quest.title);
                setTask(verificationTask);
                setStep('task');
            } catch (err) {
                console.error(err);
                setError("Failed to generate a verification task. Please try again.");
                setStep('failed');
            }
        };
        getTask();
    }, [quest.title]);

    const handleCapture = async (imageData: string) => {
        if (!task) return;
        setCapturedImage(imageData);
        setStep('verifying');
        setError(null);
        
        try {
            const result = await verifyQuestCompletionPhoto(imageData, task.code, quest.title, quest.description);
            setVerificationReason(result.reason);
            if (result.isVerified) {
                setStep('verified');
                setTimeout(onComplete, 2000); // Auto-proceed on success
            } else {
                setStep('failed');
            }
        } catch (err) {
            console.error(err);
            setError("Failed to verify the photo. It might be too large or an issue with the AI service. Please try again.");
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
            case 'generating':
                return (
                    <div className="text-center p-4 flex flex-col items-center">
                        <Spinner />
                        <p className="mt-4 font-semibold text-white">Generating verification task...</p>
                    </div>
                );
            case 'task':
                return (
                    <div className="text-center p-4 bg-gray-800 rounded-lg border border-gray-700">
                        <h3 className="text-lg font-bold text-white mb-2">Final Verification Step</h3>
                        <p className="text-gray-300 mb-4">{task?.instruction}</p>
                        <p className="text-purple-300 font-mono text-2xl bg-gray-900 py-2 px-4 rounded-md my-4 inline-block">{task?.code}</p>
                        <button onClick={() => setStep('capturing')} className="mt-6 w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg">
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
                        <p className="mt-4 font-semibold text-white">Verifying your work...</p>
                        <p className="text-sm text-gray-400">Our AI is checking your photo now.</p>
                        {capturedImage && <img src={`data:image/jpeg;base64,${capturedImage}`} alt="Verification capture" className="mt-4 rounded-lg max-w-xs mx-auto opacity-50" />}
                    </div>
                );
            
            case 'verified':
                return (
                    <div className="text-center p-4 text-green-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <h3 className="text-2xl font-bold text-white">Verification Successful!</h3>
                        <p>{verificationReason}</p>
                        <p className="mt-4 text-gray-400">Finalizing quest completion...</p>
                    </div>
                );
            
            case 'failed':
                return (
                    <div className="text-center p-4 text-red-400">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <h3 className="text-2xl font-bold text-white">Verification Failed</h3>
                        <p className="my-2">{error || verificationReason}</p>
                        <button onClick={handleRetry} className="mt-4 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-lg">
                            Try Again
                        </button>
                    </div>
                );
        }
    };
    
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-900">
            <div className="w-full max-w-md">
                <button onClick={onBack} className="text-purple-400 mb-4 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" /></svg>
                    Back to Submission
                </button>
                <div className="text-center mb-6">
                    <div className="flex justify-center mb-4">
                        <ShieldIcon className="w-16 h-16 text-purple-400" />
                    </div>
                    <h1 className="text-3xl font-bold text-white">Prove Your Work</h1>
                    <p className="text-gray-400 mt-2">Final step: a quick photo to verify you completed the quest.</p>
                </div>

                <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 min-h-[20rem] flex items-center justify-center">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default QuestVerificationScreen;