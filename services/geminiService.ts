import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from '../types';

const STORAGE_KEY = 'smile_txt_user_api_key';

// Helper to get the best available API key
const getApiKey = (customKey?: string): string | undefined => {
    // 1. Explicit custom key (for testing)
    if (customKey) return customKey;
    
    // 2. User saved key in local storage
    const storedKey = localStorage.getItem(STORAGE_KEY);
    if (storedKey) return storedKey;

    // 3. Environment variable (Default fallback)
    return process.env.API_KEY;
};

const getClient = (customKey?: string) => {
    const apiKey = getApiKey(customKey);
    if (!apiKey) {
        console.warn("No API Key found (Env or LocalStorage)");
        return null;
    }
    return new GoogleGenAI({ apiKey });
};

/**
 * Validates an API key by making a minimal request
 */
export const validateApiKey = async (key: string): Promise<boolean> => {
    try {
        const client = new GoogleGenAI({ apiKey: key });
        // Simple test query
        await client.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: 'Test',
        });
        return true;
    } catch (error) {
        console.error("API Key validation failed:", error);
        return false;
    }
};

export const saveUserApiKey = (key: string) => {
    localStorage.setItem(STORAGE_KEY, key);
};

export const removeUserApiKey = () => {
    localStorage.removeItem(STORAGE_KEY);
};

export const getUserApiKey = () => {
    return localStorage.getItem(STORAGE_KEY);
};

export const analyzeDifference = async (original: string, modified: string): Promise<AnalysisResult | null> => {
    const client = getClient();
    if (!client) return null;

    const prompt = `
    请分析“原稿”与“修改稿”之间的差异。
    
    原稿 (Original):
    """${original}"""
    
    修改稿 (Modified):
    """${modified}"""
    
    请提供：
    1. 简要总结变更内容 (Summary).
    2. 分析语气或含义的变化 (ToneChange).
    3. 一两个简短的改进建议 (Suggestions).

    请务必使用中文回答。
    `;

    try {
        const response = await client.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        summary: { type: Type.STRING },
                        toneChange: { type: Type.STRING },
                        suggestions: { type: Type.STRING }
                    },
                    required: ["summary", "toneChange", "suggestions"]
                }
            }
        });

        const text = response.text;
        if (!text) return null;
        return JSON.parse(text) as AnalysisResult;

    } catch (error) {
        console.error("Gemini analysis failed:", error);
        return null;
    }
};

export const smartOptimize = async (text: string, instruction: string): Promise<string | null> => {
    const client = getClient();
    if (!client) return null;

    try {
        const response = await client.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `请根据以下指令优化这段文本: "${instruction}"。\n\n文本:\n${text}\n\n(请直接返回优化后的文本，不要包含其他解释)`,
        });
        return response.text || null;
    } catch (error) {
        console.error("Gemini optimization failed:", error);
        return null;
    }
};