const twilio = require("twilio");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

let client;

// Lazy initialization of Twilio client to prevent crashes if environment variables are not supplied during early testing
const getTwilioClient = () => {
    if (!client) {
        if (!accountSid || !authToken) {
            console.warn("Twilio credentials missing. SMS services will operate in mock mode.");
            return null;
        }
        client = twilio(accountSid, authToken);
    }
    return client;
};

/**
 * Sends a 6-digit verification code to the target mobile number.
 * @param {string} phone - Target 10-digit Indian phone number
 * @returns {Promise<object>} Twilio Verification response or mock result
 */
module.exports.sendOTP = async (phone) => {
    const twilioClient = getTwilioClient();
    const formattedPhone = phone.startsWith("+91") ? phone : `+91${phone}`;

    if (!twilioClient || !verifyServiceSid) {
        console.log(`[MOCK SMS] Sending OTP code to ${formattedPhone}`);
        return { sid: "mock_sid", status: "pending", mock: true };
    }

    try {
        const verification = await twilioClient.verify.v2
            .services(verifyServiceSid)
            .verifications.create({ to: formattedPhone, channel: "sms" });
        return verification;
    } catch (err) {
        console.error("Twilio SMS send error:", err.message);
        throw err;
    }
};

/**
 * Verifies a 6-digit verification code entered by the user.
 * @param {string} phone - Target 10-digit Indian phone number
 * @param {string} code - 6-digit OTP code input
 * @returns {Promise<boolean>} Whether verification was successful
 */
module.exports.verifyOTP = async (phone, code) => {
    const twilioClient = getTwilioClient();
    const formattedPhone = phone.startsWith("+91") ? phone : `+91${phone}`;

    if (!twilioClient || !verifyServiceSid) {
        console.log(`[MOCK SMS] Verifying OTP ${code} for ${formattedPhone}`);
        return code === "123456"; // Default mock passcode
    }

    try {
        const verificationCheck = await twilioClient.verify.v2
            .services(verifyServiceSid)
            .verificationChecks.create({ to: formattedPhone, code });
        return verificationCheck.status === "approved";
    } catch (err) {
        console.error("Twilio SMS verification error:", err.message);
        throw err;
    }
};
