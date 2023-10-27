const USER_ERROR_CODES = {
	UNAUTHENTICATED: 'Invalid Credentials',
	USERS_NOT_FOUND: 'No users found',
	USER_NOT_FOUND: 'User not found for emailId id',
	USER_ID_NOT_FOUND: 'User Id not found',
	CREATE_USER_UNHANDLED_IN_DB: 'Something went wrong while creating new user',
	EMAIL_OR_PASSWORD_NOT_FOUND: 'Email or Password not present.',
	AUTH_HEADER_NOT_FOUND : 'No authorization header found',
};

export default USER_ERROR_CODES;