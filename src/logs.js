const MESSAGES = {
    1: 'Logged In sucessfully',
    2: 'Invalid details',
    3: 'Login Failed',
    4: 'Invalid Token: Required new login',
    5: 'Token is Empty: Required new login',
    6: "Logged out successfully",
    default: 'Something went wrong. Please try again later.'
};

export const LOG = {
    logGeneral: true,
    logNetwork: true,
    logNetworkErrors: true,
}

export const getErrorMessage = errorCode => MESSAGES[errorCode] || MESSAGES.default;
