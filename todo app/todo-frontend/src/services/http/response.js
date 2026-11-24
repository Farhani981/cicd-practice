/**
 * Success response ko standard structure me convert karta hai
 */
export const prepareResponseObject = (response) => {
    return {
        success: true,
        data: response.data,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
    };
};

/**
 * Error response ko standard structure me convert karta hai
 */
export const prepareErrorResponse = (error) => {
    const errorObj = {
        success: false,
        data: null,
        status: error.response?.status || 500,
        message: error.response?.data?.message || error.message || 'Something went wrong',
        error: error.response?.data || error,
    };

    return errorObj;
};