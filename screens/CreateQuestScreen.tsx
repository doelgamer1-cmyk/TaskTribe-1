import React, { useState } from 'react';
// FIX: Corrected import path for Icons and ensured the file is not empty.
import { ArrowLeftIcon, SparklesIcon } from '../components/common/Icons';
import { Quest, QuestValidationResult } from '../types';
// FIX: Corrected import path for geminiService and ensured the service file is not empty.
import { validateQuestCreation } from '../services/geminiService';
import Spinner from '../components/common/Spinner';

interface CreateQuestScreenProps {
  onCreate: (questData: Omit<Quest, 'id' | 'creatorId' | 'logo' | 'company' | 'status' | 'bids' | 'duration' | 'level'> & { deadline: Date }) => void;
  onBack: () => void;
}

const CreateQuestScreen: React.FC<CreateQuestScreenProps> = ({ onCreate, onBack }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [budget, setBudget] = useState('');
    const [deadline, setDeadline] = useState('');
    const [type, setType] = useState<Quest['type']>('Professional');
    const [error, setError] = useState<string | null>(null);
    
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<QuestValidationResult | null>(null);

    const handleAnalyze = async () => {
        if (!title || !description || !budget) {
            setError("Please fill in the title, description, and budget before analyzing.");
            return;
        }
        setIsAnalyzing(true);
        setError(null);
        setAnalysisResult(null);
        try {
            const result = await validateQuestCreation(title, description, parseInt(budget, 10));
            setAnalysisResult(result);
        } catch (e) {
            setError("Couldn't get AI feedback. Please try again.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleUseSuggestion = () => {
        if (analysisResult) {
            setDescription(analysisResult.improvedDescription);
            if (!analysisResult.isBudgetRealistic) {
                setBudget(analysisResult.suggestedMaxBudget.toString());
            }
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        const selectedDate = new Date(deadline);
        const today = new Date();
        today.setHours(0,0,0,0);

        if (selectedDate < today) {
            setError("Deadline must be in the future.");
            return;
        }

        if (title && description && budget && deadline) {
            onCreate({
                title,
                description,
                budget: parseInt(budget, 10),
                type,
                deadline: new Date(deadline),
            });
        }
    };
    
    const todayString = new Date().toISOString().split("T")[0];
    const canAnalyze = title && description && budget;
    const canSubmit = canAnalyze && deadline && analysisResult && !analysisResult.isJobPosting;

    return (
        <div className="min-h-screen bg-gray-900 text-white p-4">
            <div className="flex items-center mb-6">
                <button onClick={onBack} className="p-2 -ml-2"><ArrowLeftIcon className="w-6 h-6 text-purple-400"/></button>
                <h1 className="text-xl font-bold ml-2">Create a New Quest</h1>
            </div>

            <div className="w-full max-w-lg mx-auto pb-10">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white">Quest Details</h1>
                    <p className="text-gray-400 mt-2">Describe the task you need help with.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" placeholder="Quest Title (e.g., 'Logo for my new startup')" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-gray-800 border-gray-700 rounded-lg p-3" />
                    <textarea placeholder="Detailed Description..." rows={5} value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-gray-800 border-gray-700 rounded-lg p-3"></textarea>
                     <select value={type} onChange={e => setType(e.target.value as Quest['type'])} className="w-full bg-gray-800 border-gray-700 rounded-lg p-3">
                        <option>Professional</option> <option>Creative</option> <option>Community</option> <option>Skill</option>
                    </select>
                     <input type="number" placeholder="Your Maximum Budget in ₹" value={budget} onChange={e => setBudget(e.target.value)} className="w-full bg-gray-800 border-gray-700 rounded-lg p-3" />
                     <input id="deadline" type="date" min={todayString} value={deadline} onChange={e => { setDeadline(e.target.value); setError(null); }} className={`w-full bg-gray-800 border rounded-lg p-3 ${error ? 'border-red-500' : 'border-gray-700'}`} />
                     {error && <p className="text-red-400 text-sm px-1">{error}</p>}
                </form>

                <div className="my-6 border-t border-dashed border-gray-700"></div>
                
                <button onClick={handleAnalyze} disabled={!canAnalyze || isAnalyzing} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 disabled:bg-gray-700">
                    {isAnalyzing ? <Spinner /> : <SparklesIcon className="w-5 h-5" />}
                    {isAnalyzing ? 'Analyzing...' : 'Analyze Quest with AI'}
                </button>

                {analysisResult && (
                    <div className="mt-6 space-y-4 p-4 bg-gray-800/50 rounded-lg animate-fade-in">
                        <h3 className="text-lg font-bold">AI Suggestions</h3>
                        
                        {analysisResult.isJobPosting && (
                            <div className="p-3 rounded-lg text-sm bg-red-900/50 text-red-300">
                                <p className="font-bold">⚠️ Quest Policy Violation</p>
                                <p>{analysisResult.jobPostingReason}</p>
                            </div>
                        )}

                        <div className={`p-3 rounded-lg text-sm ${analysisResult.isBudgetRealistic ? 'bg-green-900/50 text-green-300' : 'bg-yellow-900/50 text-yellow-300'}`}>
                            <p className="font-semibold">Budget Feedback:</p>
                            <p>{analysisResult.suggestion}</p>
                        </div>
                         <div>
                            <p className="font-semibold text-gray-300 mb-1">Improved Description:</p>
                            <div className="p-3 bg-gray-700/50 rounded-lg text-sm whitespace-pre-wrap">{analysisResult.improvedDescription}</div>
                            <button onClick={handleUseSuggestion} className="mt-2 text-sm text-purple-400 hover:underline">Use this suggestion</button>
                        </div>
                    </div>
                )}
                
                <button onClick={handleSubmit} disabled={!canSubmit} className="mt-6 w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg disabled:bg-gray-700 disabled:cursor-not-allowed">
                    Post Quest
                </button>
            </div>
        </div>
    );
};

export default CreateQuestScreen;