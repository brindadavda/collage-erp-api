import HttpException from '../../utils/error.utils';
import USER_ERROR_CODES from './user.errors';
// eslint-disable-next-line import/no-named-as-default
import { UserModel } from './user.model';

/**
 * Creates new User in DB
 * @param userBody => User Object to be created.
 */
export async function createNewUser(userBody) {
	try {
		return await UserModel.create(userBody);
	} catch (err) {
		throw new HttpException(
			500,
			USER_ERROR_CODES.CREATE_USER_UNHANDLED_IN_DB,
			'CREATE_USER_UNHANDLED_IN_DB',
			err,
		);
	}
}

/**
 * Finds User by id from DB
 * @param id => User Object to be found.
 */
export async function findUserById(id) {
	try {
		return await UserModel.findOne({ id });
	} catch (err) {
		throw new HttpException(
			500,
			USER_ERROR_CODES.USER_ID_NOT_FOUND,
			'USER_NOT_FOUND',
			err,
		);
	}
}
/**
 * Finds Users by id from DB
 * @param id => Organization id
 */
export async function findUserByEmailAndRole(emailId , role) {
	try {
		return await UserModel.findOne({ emailId , role});
	} catch (err) {
		throw new HttpException(
			500,
			USER_ERROR_CODES.USER_NOT_FOUND,
			'USER_NOT_FOUND',
			err,
		);
	}
}

export async function findUserByIdAndToken(id , token) {
	try {
		return await UserModel.findOne({ _id : id , "tokens.token" : token});
	} catch (err) {
		throw new HttpException(
			500,
			USER_ERROR_CODES.USER_NOT_FOUND,
			'USER_NOT_FOUND',
			err,
		);
	}
}

/**
 * Find User by email from DB
 * @param emailId => Email of the user
 */
export async function findUserByEmail(emailId) {
	try {
		return await UserModel.findOne({ emailId });
	} catch (err) {
		throw new HttpException(
			500,
			USER_ERROR_CODES.USER_NOT_FOUND,
			'USER_NOT_FOUND',
			err,
		);
	}
}

/**
 * List Users from DB
 */
export async function findUsers() {
	try {
		return await UserModel.find().lean();
	} catch (err) {
		throw new HttpException(
			500,
			USER_ERROR_CODES.USER_NOT_FOUND,
			'USERS_NOT_FOUND',
			err,
		);
	}
}