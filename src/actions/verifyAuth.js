import Url                                            from 'url';

import { parseHeaders, areHeadersBlank, getHeaders }  from 'utils/headers';
import { getSettings }                                from 'models/settings';
import fetch                                          from 'utils/fetch';
import getRedirectInfo                                from 'utils/getRedirectInfo';
import { authenticateStart }                          from 'actions/authenticate';

import keys                                           from 'lodash/keys';

export default function (currentLocation) {
  return (dispatch, getState) => {
    const state = getState();
    let headers = getHeaders(state);

    const { backend, tokenFormat } = getSettings(state);
    const { authRedirectHeaders }  = getRedirectInfo(Url.parse(currentLocation), tokenFormat);

    if (!areHeadersBlank(authRedirectHeaders, tokenFormat)) {
      headers = parseHeaders(authRedirectHeaders, tokenFormat);
    }

    console.log('headers =', headers);
    console.log('keys(headers).length =', keys(headers).length);

    if (keys(headers).length === 0) {
      return Promise.reject({ reason: 'No creds' });
    }

    const url = `${backend.tokenValidationPath}?unbatch=true`;

    dispatch(authenticateStart());
    console.log('validation url =', url);
    console.log('dispatch =', dispatch);

    return dispatch(fetch(url))
      .then(resp => resp.json())
      .then(json => {
        console.log('validation response =', json);

        if (json.success) {
          return Promise.resolve({ user: json.data });
        }

        return Promise.reject({ errors: json.errors });
      });
  };
}
