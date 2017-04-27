import Cookies          from 'js-cookie';
import { getSettings }  from 'models/settings';

export const UPDATE_HEADERS = 'UPDATE_HEADERS';

export function updateHeaders(headers = {}) {
  return (dispatch, getState) => {
    const { cookieOptions } = getSettings(getState());

    Cookies.set(cookieOptions.key, JSON.stringify(headers), {
      expires: cookieOptions.expire,
      path: cookieOptions.path,
      secure: cookieOptions.secure,
      sameSite: cookieOptions.sameSite
    });

    return dispatch({ type: UPDATE_HEADERS, headers });
  };
}
