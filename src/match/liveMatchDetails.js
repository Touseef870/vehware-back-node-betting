import https from 'https';
import dotenv from 'dotenv';

dotenv.config();

// Helper function for error responses
const sendError = (res, status, message, internalDetails = {}) => {
    console.error(`API Error [${status}]:`, { message, ...internalDetails });
    return res.status(status).json({
        success: false,
        error: message,
        code: `ERR-${status}`
    });
};

export default async function getLiveMatchDetails(req, res) {
    // Validate matchId
    const { matchId } = req.query;

    if (!matchId) {
        return sendError(res, 400, 'Match ID is required', { receivedId: matchId });
    }

    if (!/^\d+$/.test(matchId)) {
        return sendError(res, 400, 'Invalid Match ID format', { invalidId: matchId });
    }

    // API Configuration
    const apiOptions = {
        method: 'GET',
        hostname: 'cricbuzz-cricket.p.rapidapi.com',
        path: `/mcenter/v1/${matchId}`,
        headers: {
            'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
            'X-RapidAPI-Host': 'cricbuzz-cricket.p.rapidapi.com'
        },
        timeout: 10000 // 10 seconds timeout
    };

    // Request Handler
    const request = https.request(apiOptions, (apiResponse) => {
        let responseData = '';
        let isResponseValid = false;

        // Validate content type
        const contentType = apiResponse.headers['content-type'];
        if (!contentType?.includes('application/json')) {
            return sendError(res, 502, 'Invalid API response format', {
                contentType,
                statusCode: apiResponse.statusCode
            });
        }

        // Data processing
        apiResponse
            .on('data', (chunk) => (responseData += chunk))
            .on('end', () => {
                try {
                    const parsedData = JSON.parse(responseData);

                    // Check for API-specific errors
                    if (apiResponse.statusCode !== 200) {
                        return sendError(res, apiResponse.statusCode, parsedData.message || 'API Error', {
                            apiStatusCode: apiResponse.statusCode,
                            apiError: parsedData
                        });
                    }

                    // Validate response structure
                    if (!parsedData?.matchDetails?.matchSummary) {
                        return sendError(res, 502, 'Incomplete match data received', {
                            dataStructure: Object.keys(parsedData)
                        });
                    }

                    // Success response
                    res.json({
                        success: true,
                        data: parsedData
                    });

                } catch (parseError) {
                    sendError(res, 500, 'Failed to process API response', {
                        parseError: parseError.message,
                        rawResponse: responseData.slice(0, 500) // Limit logging
                    });
                }
            });
    });

    // Error Handling
    request
        .on('error', (error) => {
            if (error.code === 'ECONNRESET') {
                sendError(res, 504, 'API connection timeout');
            } else {
                sendError(res, 500, 'Network request failed', {
                    errorCode: error.code,
                    errorMessage: error.message
                });
            }
        })
        .on('timeout', () => {
            request.destroy();
            sendError(res, 504, 'API request timed out');
        });

    request.end();
}