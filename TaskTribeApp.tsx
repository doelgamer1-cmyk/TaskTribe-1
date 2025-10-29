import React, { useState, useEffect } from 'react';
import { Quest, User, Tribe, Bid } from './types';
import { moderateContent } from './services/geminiService';
import { sendVerificationEmail, sendVerificationSms } from './services/authService';

// Screen Imports
import SplashScreen from './screens/SplashScreen';
import AgeSelectionScreen from './screens/AgeSelectionScreen';
import TeenSignupScreen from './screens/TeenSignupScreen';
import GuardianVerificationScreen from './screens/GuardianVerificationScreen';
import OTPScreen from './screens/OTPScreen';
import HomeScreen from './screens/HomeScreen';
import QuestsScreen from './screens/QuestsScreen';
import TribesDiscoveryScreen from './screens/TribesDiscoveryScreen';
import TribeDetailScreen from './screens/TribeDetailScreen';
import TribeHomeScreen from './screens/TribeHomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import QuestDetailScreen from './screens/QuestDetailScreen';
import QuestApplicationScreen from './screens/QuestApplicationScreen';
import ApplicationSubmittedScreen from './screens/ApplicationSubmittedScreen';
import ActiveTaskScreen from './screens/ActiveTaskScreen';
import SubmissionConfirmationScreen from './screens/SubmissionConfirmationScreen';
import VerificationInProgressScreen from './screens/VerificationInProgressScreen';
import QuestCompleteScreen from './screens/QuestCompleteScreen';
import SubmissionRejectedScreen from './screens/SubmissionRejectedScreen';
import QuestVerificationScreen from './screens/QuestVerificationScreen';
import QuestBiddingScreen from './screens/QuestBiddingScreen';
import BidSubmittedScreen from './screens/BidSubmittedScreen';

import AdultSignupScreen from './screens/AdultSignupScreen';
import KYCVerificationScreen from './screens/KYCVerificationScreen';
import PaymentSetupScreen from './screens/PaymentSetupScreen';
import ProfileSetupScreen from './screens/ProfileSetupScreen';
import OnboardingCompleteScreen from './screens/OnboardingCompleteScreen';
import CreateQuestScreen from './screens/CreateQuestScreen';

// MOCK DATA
const MOCK_USER_TEEN: User = {
    username: 'Alex_Design',
    isAdult: false,
    level: 1,
    xp: 150,
    isTribeMember: false,
    tasksCompleted: 0
};

const MOCK_USER_ADULT: User = {
    username: 'Priya_Designs',
    isAdult: true,
    level: 24,
    xp: 23500,
    isTribeMember: true,
    tasksCompleted: 42,
    rating: 4.9,
    fullName: "Priya Sharma",
    headline: "UX/UI Designer & Illustrator",
    bio: "Passionate designer with 5+ years of experience creating intuitive and beautiful digital products. Let's build something amazing together!",
    skills: ["UI/UX Design", "Figma", "Illustration", "Prototyping", "Web Design"]
};

const MOCK_QUESTS: Quest[] = [
    { id: 'q1', title: 'Design a Logo for "EcoFresh" startup', description: 'We need a modern, minimalist logo for our new eco-friendly cleaning products brand.', company: 'EcoFresh Inc.', logo: 'https://placehold.co/64x64/28a745/FFFFFF?text=E', type: 'Creative', deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), level: 5, budget: 5000, creatorId: 'Priya_Designs', status: 'OPEN', bids: [] },
    { id: 'q2', title: 'Write 3 Blog Posts about Sustainable Living', description: 'Looking for a writer to create three 500-word blog posts on topics related to sustainability.', company: 'GreenThumb Blog', logo: 'https://placehold.co/64x64/17a2b8/FFFFFF?text=G', type: 'Professional', deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), level: 8, reward: 3000, creatorId: 'some_other_user', status: 'OPEN', bids: [] },
    { id: 'q3', title: 'Create a Short promotional video', description: 'Create a 15-second video for social media promoting our new app.', company: 'Appify', logo: 'https://placehold.co/64x64/6f42c1/FFFFFF?text=A', type: 'Creative', deadline: new Date(Date.now() + 18 * 60 * 60 * 1000), level: 10, budget: 8000, creatorId: 'Priya_Designs', status: 'PENDING_VERIFICATION', bids: [], winner: { userId: 'Alex_Design', bidAmount: 7500 }},
];

const MOCK_TRIBE: Tribe = { id: 't1', name: 'Design Warriors', tagline: "Creating beauty, one pixel at a time", level: 18, levelName: "Gold", members: 42, maxMembers: 50, rank: 3, winRate: 67, tags: ["Design", "Creative", "Active"], status: 'Recruiting', bannerUrl: 'https://placehold.co/600x200/1a1a2e/e94560', iconUrl: 'https://placehold.co/64x64/e94560/1a1a2e?text=DW' };


type AppState = 'splash' | 'age_selection'
    | 'teen_signup' | 'teen_otp_verification' | 'guardian_verification' | 'guardian_otp_verification'
    | 'adult_signup' | 'adult_otp_verification' | 'kyc_verification' | 'payment_setup' | 'profile_setup' | 'onboarding_complete'
    | 'main_app' | 'quest_detail' | 'quest_application' | 'application_submitted' | 'quest_bidding' | 'bid_submitted'
    | 'active_task' | 'submitting_task' | 'submission_confirmation' | 'quest_photo_verification' | 'submission_rejected' | 'quest_complete'
    | 'tribe_detail' | 'create_quest';

const TaskTribeApp: React.FC = () => {
    const [appState, setAppState] = useState<AppState>('splash');
    const [user, setUser] = useState<User | null>(null);
    const [verificationContact, setVerificationContact] = useState('');
    const [otpToVerify, setOtpToVerify] = useState<string | null>(null);
    const [quests, setQuests] = useState<Quest[]>(MOCK_QUESTS);
    const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
    const [selectedTribe, setSelectedTribe] = useState<Tribe | null>(null);
    const [currentView, setCurrentView] = useState<'home' | 'quests' | 'tribes' | 'profile'>('home');
    const [submissionRejectionReason, setSubmissionRejectionReason] = useState<string | null>(null);

    // Splash screen effect
    useEffect(() => {
        if (appState === 'splash') {
            const timer = setTimeout(() => setAppState('age_selection'), 2500);
            return () => clearTimeout(timer);
        }
    }, [appState]);

    const handleSelectTeen = () => setAppState('teen_signup');
    const handleSelectAdult = () => setAppState('adult_signup');
    
    const handleTeenSignup = async (username: string, phone: string) => {
        const otp = await sendVerificationSms(phone);
        setOtpToVerify(otp);
        setUser({ ...MOCK_USER_TEEN, username });
        setVerificationContact(phone);
        setAppState('teen_otp_verification');
    };
    const handleTeenOTPVerified = () => setAppState('guardian_verification');
    
    const handleGuardianVerification = async (phone: string) => {
        const otp = await sendVerificationSms(phone);
        setOtpToVerify(otp);
        setVerificationContact(phone);
        setAppState('guardian_otp_verification');
    };
    const handleVerificationComplete = () => {
        // In a real app, this would be triggered by a server event
        setAppState('main_app');
    };

    const handleAdultSignup = async (email: string) => {
        const otp = await sendVerificationEmail(email);
        setOtpToVerify(otp);
        setVerificationContact(email);
        setAppState('adult_otp_verification');
    };
    const handleAdultOTPVerified = () => setAppState('kyc_verification');
    const handleKYCComplete = () => setAppState('payment_setup');
    const handlePaymentComplete = () => setAppState('profile_setup');
    const handleProfileComplete = () => {
        setUser(MOCK_USER_ADULT);
        setAppState('onboarding_complete');
    }
    const handleOnboardingComplete = () => setAppState('main_app');

    const handleSelectQuest = (quest: Quest) => {
        setSelectedQuest(quest);
        setAppState('quest_detail');
    };
    
    const handleQuestAction = () => {
        if (!selectedQuest) return;
        // If quest has a budget, it's a bidding quest. Otherwise, it's a direct application.
        if (selectedQuest.budget) {
            setAppState('quest_bidding');
        } else {
            setAppState('quest_application');
        }
    };
    
    const handlePlaceBid = (bidAmount: number, proposal: string) => {
        if (!selectedQuest || !user) return;
        const newBid: Bid = {
            userId: user.username,
            username: user.username,
            amount: bidAmount,
            proposal: proposal,
            timestamp: new Date(),
            avatarUrl: `https://placehold.co/64x64/86efac/FFFFFF?text=${user.username.charAt(0).toUpperCase()}`
        };

        const updatedQuests = quests.map(q => 
            q.id === selectedQuest.id ? { ...q, bids: [...q.bids, newBid] } : q
        );
        setQuests(updatedQuests);
        setAppState('bid_submitted');
    };

    const handleSelectTribe = (tribe: Tribe) => {
        setSelectedTribe(tribe);
        setAppState('tribe_detail');
    };

    const handleNavigate = (view: 'home' | 'quests' | 'tribes' | 'profile') => {
        setCurrentView(view);
    };

    const handleCreateQuest = (questData: Omit<Quest, 'id' | 'creatorId' | 'logo' | 'company' | 'status' | 'bids' | 'duration' | 'level'> & { deadline: Date }) => {
        if(!user) return;
        const newQuest: Quest = {
            ...questData,
            id: `q${quests.length + 1}`,
            creatorId: user.username,
            logo: 'https://placehold.co/64x64/6f42c1/FFFFFF?text=C',
            company: user.fullName || user.username,
            status: 'OPEN',
            bids: [],
            level: user.level,
        };
        setQuests(prev => [newQuest, ...prev]);
        setAppState('main_app');
        setCurrentView('quests');
    };

    const handleSubmission = async (submission: string) => {
        if (!selectedQuest || !user) return;

        setAppState('submitting_task');
        try {
            const moderationResult = await moderateContent(submission);

            if (moderationResult.isFlagged) {
                setSubmissionRejectionReason(moderationResult.reason || "Content violates community guidelines.");
                setAppState('submission_rejected');
            } else {
                // Logic for successful submission
                // FIX: Use 'as const' to assert the literal type for QuestStatus, preventing a TypeScript type-widening issue.
                const updatedQuests = quests.map(q => 
                    q.id === selectedQuest.id 
                    ? { ...q, status: 'PENDING_VERIFICATION' as const, submission: { userId: user!.username, content: submission } } 
                    : q
                );
                setQuests(updatedQuests);
                // Simulate backend confirmation
                setTimeout(() => {
                    setAppState('submission_confirmation');
                }, 1500);
            }
        } catch (error) {
            console.error("Moderation failed:", error);
            setSubmissionRejectionReason("An error occurred during verification. Please check your connection and try again.");
            setAppState('submission_rejected');
        }
    };
    
    const handleQuestCompletion = () => {
        if (!selectedQuest || !user) return;
        
        // FIX: Use 'as const' to assert the literal type for QuestStatus, preventing a TypeScript type-widening issue.
        const updatedQuests = quests.map(q => 
            q.id === selectedQuest.id ? { ...q, status: 'COMPLETED' as const } : q
        );
        setQuests(updatedQuests);

        const reward = selectedQuest.reward || selectedQuest.winner?.bidAmount || 50;
        setUser(prevUser => prevUser ? { ...prevUser, xp: prevUser.xp + reward, tasksCompleted: prevUser.tasksCompleted + 1 } : null);

        setAppState('quest_complete');
    };

    const renderMainApp = () => {
        if (!user) return <AgeSelectionScreen onSelectTeen={handleSelectTeen} onSelectAdult={handleSelectAdult} />;

        if (user.isTribeMember && currentView === 'tribes') {
             return <TribeHomeScreen tribe={MOCK_TRIBE} onNavigate={handleNavigate} />;
        }

        switch (currentView) {
            case 'quests':
                return <QuestsScreen user={user} quests={quests} onSelectQuest={handleSelectQuest} onNavigate={handleNavigate} />;
            case 'tribes':
                return <TribesDiscoveryScreen onSelectTribe={handleSelectTribe} onBack={() => handleNavigate('home')} />;
            case 'profile':
                return <ProfileScreen user={user} quests={quests} onSelectQuest={handleSelectQuest} onBack={() => handleNavigate('home')} />;
            case 'home':
            default:
                return <HomeScreen user={user} quests={quests} onNavigate={handleNavigate} onSelectQuest={handleSelectQuest} onCreateQuest={() => setAppState('create_quest')} />;
        }
    };


    switch (appState) {
        case 'splash':
            return <SplashScreen onComplete={() => setAppState('age_selection')} />;
        case 'age_selection':
            return <AgeSelectionScreen onSelectTeen={handleSelectTeen} onSelectAdult={handleSelectAdult} />;
        
        case 'teen_signup':
            return <TeenSignupScreen onSignup={handleTeenSignup} />;
        case 'teen_otp_verification':
            return <OTPScreen verificationTarget={verificationContact} expectedOtp={otpToVerify} onVerify={handleTeenOTPVerified} onBack={() => setAppState('teen_signup')} />;
        case 'guardian_verification':
            return <GuardianVerificationScreen onVerify={handleGuardianVerification} />;
        case 'guardian_otp_verification':
             return <OTPScreen verificationTarget={verificationContact} expectedOtp={otpToVerify} onVerify={handleVerificationComplete} onBack={() => setAppState('guardian_verification')} />;

        case 'adult_signup':
            return <AdultSignupScreen onSignup={handleAdultSignup} />;
        case 'adult_otp_verification':
            return <OTPScreen verificationTarget={verificationContact} expectedOtp={otpToVerify} onVerify={handleAdultOTPVerified} onBack={() => setAppState('adult_signup')} />;
        case 'kyc_verification':
            return <KYCVerificationScreen onComplete={handleKYCComplete} />;
        case 'payment_setup':
            return <PaymentSetupScreen onComplete={handlePaymentComplete} />;
        case 'profile_setup':
            return <ProfileSetupScreen onComplete={handleProfileComplete} />;
        case 'onboarding_complete':
            return <OnboardingCompleteScreen onContinue={handleOnboardingComplete} />;

        case 'quest_detail':
            return selectedQuest && <QuestDetailScreen quest={selectedQuest} onBack={() => setAppState('main_app')} onApply={handleQuestAction} currentUser={user} />;
        case 'quest_application':
            return selectedQuest && <QuestApplicationScreen quest={selectedQuest} onBack={() => setAppState('quest_detail')} onSubmit={() => setAppState('application_submitted')} />;
        case 'application_submitted':
            return <ApplicationSubmittedScreen onContinue={() => setAppState('active_task')} />;
        case 'quest_bidding':
            return selectedQuest && <QuestBiddingScreen quest={selectedQuest} onBack={() => setAppState('quest_detail')} onSubmit={handlePlaceBid} />;
        case 'bid_submitted':
            return <BidSubmittedScreen onContinue={() => {
                setAppState('main_app');
                setCurrentView('quests');
            }} />;
        case 'active_task':
            return selectedQuest && <ActiveTaskScreen quest={selectedQuest} onSubmit={handleSubmission} />;
        case 'submitting_task':
            return <VerificationInProgressScreen />;
        case 'submission_rejected':
            return <SubmissionRejectedScreen reason={submissionRejectionReason || "An unknown error occurred."} onRetry={() => setAppState('active_task')} />;
        case 'submission_confirmation':
            return <SubmissionConfirmationScreen onContinue={() => setAppState('quest_photo_verification')} />;
        case 'quest_photo_verification':
            return selectedQuest && <QuestVerificationScreen quest={selectedQuest} onComplete={handleQuestCompletion} onBack={() => setAppState('active_task')} />;
        case 'quest_complete':
            return selectedQuest && <QuestCompleteScreen quest={selectedQuest} onContinue={() => {
                setAppState('main_app');
                setSelectedQuest(null);
            }} />;
        case 'tribe_detail':
            return selectedTribe && <TribeDetailScreen tribe={selectedTribe} onBack={() => setAppState('main_app')} onJoin={() => {
                if (user) setUser({ ...user, isTribeMember: true });
                setAppState('main_app');
                setCurrentView('tribes');
            }} />;
        
        case 'create_quest':
            return <CreateQuestScreen onCreate={handleCreateQuest} onBack={() => setAppState('main_app')} />;

        case 'main_app':
        default:
            return renderMainApp();
    }
};

export default TaskTribeApp;