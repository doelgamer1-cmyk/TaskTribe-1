import React, { useRef, useEffect, useState } from 'react';

interface CameraCaptureProps {
    onCapture: (imageData: string) => void;
    onCancel: () => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, onCancel }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const getCamera = async () => {
            try {
                const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
                setStream(mediaStream);
                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream;
                }
            } catch (err) {
                console.error("Error accessing camera:", err);
                setError("Could not access camera. Please check permissions and try again.");
            }
        };

        getCamera();

        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const handleCapture = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const context = canvas.getContext('2d');
            if (context) {
                // Draw the raw (un-mirrored) video frame to the canvas.
                // This ensures text is readable for the AI. The live preview remains mirrored for user convenience via CSS.
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                // remove 'data:image/jpeg;base64,' prefix
                const imageData = canvas.toDataURL('image/jpeg').split(',')[1];
                onCapture(imageData);
            }
        }
    };

    if (error) {
        return (
            <div className="text-center p-4 bg-red-900/50 text-red-300 rounded-lg">
                <p>{error}</p>
                <button onClick={onCancel} className="mt-4 text-white underline">Go Back</button>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="relative w-full aspect-square bg-gray-900 rounded-lg overflow-hidden border-2 border-gray-700">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover transform -scale-x-100"></video>
                <canvas ref={canvasRef} className="hidden"></canvas>
            </div>
            <div className="flex items-center justify-center mt-4 gap-4">
                <button onClick={onCancel} className="text-gray-400 font-semibold py-2 px-4 rounded-lg">Cancel</button>
                <button onClick={handleCapture} className="bg-purple-600 hover:bg-purple-700 text-white font-bold p-4 rounded-full transition-colors duration-200 ring-4 ring-purple-600/50">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default CameraCapture;