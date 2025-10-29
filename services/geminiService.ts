import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { QuestValidationResult, ModerationResult, PhotoVerificationTask, PhotoVerificationResult } from "./types";
import { generateComplexCode } from '../utils';

// FIX: Initialize the GoogleGenAI client according to guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateMapsResponse = async (
  prompt: string,
  location: { latitude: number; longitude: number } | null
): Promise<GenerateContentResponse> => {
  const config: {
    tools: { googleMaps: {} }[];
    toolConfig?: any;
  } = {
    tools: [{ googleMaps: {} }],
  };

  if (location) {
    config.toolConfig = {
      retrievalConfig: {
        latLng: {
          latitude: location.latitude,
          longitude: location.longitude,
        },
      },
    };
  }

  // FIX: Use ai.models.generateContent for map-grounded responses
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: config,
  });

  return response;
};

export const analyzeVideo = async (
  videoBase64: string,
  mimeType: string,
  prompt: string
): Promise<string> => {
  const videoPart = {
    inlineData: {
      data: videoBase64,
      mimeType: mimeType,
    },
  };

  const textPart = {
    text: prompt,
  };

  // FIX: Use gemini-2.5-pro for complex video analysis tasks
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-pro',
    contents: { parts: [videoPart, textPart] },
  });

  return response.text;
};

export const validateQuestCreation = async (
  title: string,
  description: string,
  budget: number
): Promise<QuestValidationResult> => {

  const prompt = `
    Analyze the following task posting for a platform called TaskTribe.
    
    Rules:
    1.  The platform is for short-term "quests" or "gigs", not permanent or full-time jobs. A quest should be a single, completable task.
    2.  The budget is in Indian Rupees (₹). Analyze if the budget is realistic for the described task. It can be low if it's a simple task.
    3.  Suggest a more descriptive and appealing description for the quest.
    4.  Your entire response must be in the specified JSON format.

    Task Title: "${title}"
    Task Description: "${description}"
    Proposed Budget: ₹${budget}
    `;

  // FIX: Define a response schema for structured JSON output
  const responseSchema = {
    type: Type.OBJECT,
    properties: {
        isJobPosting: { type: Type.BOOLEAN },
        jobPostingReason: { type: Type.STRING },
        isBudgetRealistic: { type: Type.BOOLEAN },
        suggestedMaxBudget: { type: Type.NUMBER },
        suggestion: { type: Type.STRING },
        improvedDescription: { type: Type.STRING },
    },
  };
  
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: responseSchema,
    },
  });

  const jsonText = response.text.trim();
  return JSON.parse(jsonText) as QuestValidationResult;
};

export const moderateContent = async (text: string): Promise<ModerationResult> => {
    const prompt = `
    You are a content moderator for a platform called TaskTribe which is used by teenagers. 
    Your role is to ensure the platform is safe and respectful.
    Analyze the following text for any violations of community guidelines. Check for:
    - Profanity or explicit language
    - Hate speech, racism, or discrimination
    - Bullying or harassment
    - Spam or scams
    - Self-harm or dangerous content
    - Any other inappropriate content for a teenage audience.

    The text to analyze is: "${text}"

    Your entire response must be in the specified JSON format. 
    If it is safe, set "isFlagged" to false. 
    If it violates guidelines, set "isFlagged" to true and provide a brief, user-friendly "reason".
    `;

    const responseSchema = {
        type: Type.OBJECT,
        properties: {
            isFlagged: { type: Type.BOOLEAN, description: "Whether the content violates guidelines." },
            reason: { type: Type.STRING, description: "A brief, user-friendly reason for flagging." },
        },
        required: ['isFlagged']
    };

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            },
        });

        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as ModerationResult;
    } catch (error) {
        console.error("Error in content moderation:", error);
        // Fallback to a safe default: flag the content if the API fails.
        return {
            isFlagged: true,
            reason: "Could not be verified at this time. Please try resubmitting."
        };
    }
};

export const generateVerificationTask = async (): Promise<PhotoVerificationTask> => {
    const prompt = `Generate a simple, unique verification task for a user. The task should involve writing a short, random alphanumeric code on a piece of paper. The code should be 6 characters long, in the format XX-XXX or XXX-XX.
    
    Your response must be in the specified JSON format. Provide the code and a user-friendly instruction like "Write the following code on a piece of paper and hold it clearly in a selfie:".`;

    const responseSchema = {
        type: Type.OBJECT,
        properties: {
            code: { type: Type.STRING, description: "A random 6-character alphanumeric code." },
            instruction: { type: Type.STRING, description: "A user-friendly instruction to write the code and take a photo." },
        },
        required: ['code', 'instruction']
    };

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: responseSchema,
        },
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as PhotoVerificationTask;
};

export const verifyPhotoTask = async (imageBase64: string, taskCode: string): Promise<PhotoVerificationResult> => {
    const imagePart = {
        inlineData: {
            data: imageBase64,
            mimeType: 'image/jpeg',
        },
    };

    const prompt = `
    You are a strict security AI for an identity verification system. Your primary task is to analyze an image to confirm a user has completed a specific real-world task.

    The user was given a unique code, "${taskCode}", and instructed to **write it on a piece of paper and take a selfie while holding it**.

    You must verify the following conditions STRICTLY. **ALL conditions must be met for verification to pass.**

    1.  **Person is Present and Holding the Paper**: A real person's face must be clearly visible in the photo. This person must be physically holding the piece of paper with the code. A photo of only the paper and code is an immediate failure.
    2.  **Code is Correct and Handwritten**: The code on the paper must exactly match "${taskCode}". It must be clearly handwritten, not typed or digitally added.
    3.  **Image Authenticity**: The image must be a genuine, real-world photograph. It cannot be a picture of another screen (like a phone or monitor), a printed photo, or a digitally manipulated image.

    Your entire response must be in the specified JSON format.
    - Set "isVerified" to true **only if all three conditions are met**.
    - Provide a "reason" that clearly explains your decision. For failure, state which condition was not met (e.g., "Verification failed because no person was visible in the photo.", "Verification failed because the code was incorrect.", "Verification failed because the image appears to be a picture of a screen."). For success, state "User and code verified successfully."
    `;

    const responseSchema = {
        type: Type.OBJECT,
        properties: {
            isVerified: { type: Type.BOOLEAN },
            reason: { type: Type.STRING },
        },
        required: ['isVerified', 'reason']
    };

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [imagePart, { text: prompt }] },
        config: {
            responseMimeType: "application/json",
            responseSchema: responseSchema,
        }
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as PhotoVerificationResult;
};

export const generateQuestVerificationTask = async (questTitle: string): Promise<PhotoVerificationTask> => {
    const code = generateComplexCode();

    const prompt = `A user completed a task: "${questTitle}". To verify their work, they need to take a photo of it with a unique code. The code is "${code}". Create a simple, user-friendly instruction telling them to write this code on paper and place it next to their completed work in a photo. For example, if it's a design on a screen, they should put the paper next to the screen. Your response must be a JSON object with an "instruction" field.`;
    
    const responseSchema = {
        type: Type.OBJECT,
        properties: {
            instruction: { type: Type.STRING },
        },
        required: ['instruction']
    };
    
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: responseSchema,
        },
    });

    const result = JSON.parse(response.text.trim()) as { instruction: string };
    
    return {
        code: code,
        instruction: result.instruction,
    };
};

export const verifyQuestCompletionPhoto = async (imageBase64: string, taskCode: string, questTitle: string, questDescription: string): Promise<PhotoVerificationResult> => {
    const imagePart = {
        inlineData: {
            data: imageBase64,
            mimeType: 'image/jpeg',
        },
    };

    const prompt = `
    You are a strict AI verifier for a platform called TaskTribe. A user has submitted a photo to prove they completed a task.
    
    The task details are:
    - Title: "${questTitle}"
    - Description: "${questDescription}"

    The verification requirement was to take a photo showing the **completed work** alongside a handwritten code on a piece of paper. The code is: "${taskCode}".

    You must verify the following conditions STRICTLY. **ALL conditions must be met for verification to pass.**

    1.  **Completed Work is Visible**: The photo must clearly show the result of the completed task. Based on the title and description, determine if the object in the photo matches the expected deliverable (e.g., a logo on a screen, a written article, a crafted item).
    2.  **Code is Correct and Handwritten**: A piece of paper with the code "${taskCode}" must be visible in the photo. The code must be handwritten and an exact match.
    3.  **Image Authenticity**: The image must be a genuine, real-world photograph, not a screenshot or a picture of another screen showing a composite image.

    Your entire response must be in the specified JSON format.
    - Set "isVerified" to true **only if all three conditions are met**.
    - Provide a "reason" that clearly explains your decision. For failure, state which condition was not met (e.g., "Verification failed because the completed work was not visible.", "Verification failed because the code was incorrect or missing."). For success, state "Completed work and code verified successfully."
    `;

    const responseSchema = {
        type: Type.OBJECT,
        properties: {
            isVerified: { type: Type.BOOLEAN },
            reason: { type: Type.STRING },
        },
        required: ['isVerified', 'reason']
    };

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [imagePart, { text: prompt }] },
        config: {
            responseMimeType: "application/json",
            responseSchema: responseSchema,
        }
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as PhotoVerificationResult;
};