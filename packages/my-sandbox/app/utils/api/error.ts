/**
 * Enumerates the currently available Api statuses
 * @type {number}
 */
export enum ApiResponseStatus {
  NotFound = 404,
  UnAuthorized = 401,
  InternalServerError = 500
}

/**
 * Returns a default msg for a given status
 * @param {ApiResponseStatus} status
 * @returns {string}
 */
const apiErrorStatusMessage = (status: ApiResponseStatus): string =>
  (<{ [prop: number]: string }>{
    [ApiResponseStatus.NotFound]: 'Could not find the requested resource',
    [ApiResponseStatus.InternalServerError]: 'An error occurred with the server'
  })[status];

/**
 * Extends the built-in Error class with attributes related to treating non 200 OK responses
 * at the api layer as exceptions
 * @class ApiError
 * @extends {Error}
 */
class ApiError extends Error {
  /**
   * Timestamp of when the exception occurred
   * @readonly
   * @memberof ApiError
   */
  readonly timestamp = new Date();

  constructor(readonly status: ApiResponseStatus, message: string, ...args: Array<any>) {
    super(...[message, ...args]);
    // Fixes downlevel compiler limitation with correct prototype chain adjustment
    // i.e. ensuring this is also `instanceof` subclass
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

/**
 * Wraps a Response object, pass through json response if no api error,
 * otherwise raise exception with error message
 * @template T
 * @param {Response} response
 * @returns {Promise<T>}
 */
// Throws error in ember-cli-typescript@2.0.0-beta.3 but not ember-cli-typescript@1.5.0
const throwIfApiError = async function<T>(response: Response): Promise<T> {
  const { status, ok } = response;

  if (!ok) {
    const { msg = apiErrorStatusMessage(status) } = await response.json();
    throw new ApiError(status, msg);
  }

  return response.json();
};

export default throwIfApiError;
