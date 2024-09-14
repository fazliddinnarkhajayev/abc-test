const ErrorMessages = {
    UserExists: 'User already exists',
    UnverifiedUser: 'Unverified User',
    NotFound: 'Content not found',
    FailedToCreate: 'Failed to create data',
    FailedToDelete: 'Failed to delete data',
    FailedToUpdate: 'Failed to update data',
    FailedToLike: 'Failed to like this post',
    NoContent: 'No content found',
    SelfLike: 'You cannot like yourself',
    AlreadyLiked: 'You have already liked this post',
    AlreadyVerified: 'Your account is already verified',
    FaliedToSendVerificationCode: 'Failed to send verification code',
    VerificationCodeExpired: 'Verification code expired',
    InvalidVerificationCode: 'Invalid verification code',
    FailedToVerifyEmail: 'Failed to verify email',
    InvalidCredentials: 'Invalid credentials',
};

module.exports = { ErrorMessages }