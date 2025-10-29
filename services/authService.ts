// This service simulates sending OTPs for verification.
// In a real application, this would use a backend service like Twilio for SMS or SendGrid for email.

/**
 * Simulates sending a verification SMS.
 * @param phone The phone number to send the OTP to.
 * @returns A promise that resolves with the generated OTP.
 */
export const sendVerificationSms = async (phone: string): Promise<string> => {
    console.log(`--- SIMULATING SMS ---`);
    const otp = "111111";
    console.log(`To: ${phone}`);
    console.log(`Your TaskTribe verification code is: ${otp}`);
    console.log(`--------------------`);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return otp;
};

/**
 * Simulates sending a verification email.
 * @param email The email address to send the OTP to.
 * @returns A promise that resolves with the generated OTP.
 */
export const sendVerificationEmail = async (email: string): Promise<string> => {
    console.log(`--- SIMULATING EMAIL ---`);
    const otp = "111111";
    console.log(`To: ${email}`);
    console.log(`Subject: Your TaskTribe Verification Code`);
    console.log(`Your one-time password is: ${otp}`);
    console.log(`----------------------`);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return otp;
};