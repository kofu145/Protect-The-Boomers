type SessionToken = string;

const loginApiUrl = "api/login";

/**
 * A type for successful login responses.
 */
type SuccessfulLogInResponse = {
    kind: 'success',
    session_token: SessionToken
};

/**
 * A type for server unavailable responses.
 */
type ServerUnavailableResponse = {
    kind: 'server-unavailable'
}

/**
 * A type for server invalid credentials login responses.
 */
type InvalidCredentialsResponse = {
    kind: 'invalid-credentials'
}

type LogInResponse = SuccessfulLogInResponse | ServerUnavailableResponse | InvalidCredentialsResponse;

/**
 * Sends an HTTP POST request that lets the user log in.
 * @param phone_number The user's phone number.
 * @param password The user's password.
 */
export async function logIn(phone_number: string, password: string): Promise<LogInResponse> {
    try {
        let response = await fetch(loginApiUrl, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ phone_number, password })
        });
        if (response.ok) {
            let json = await response.json();
            return { kind: 'success', session_token: json.session_id };
        }
        else if (response.status === 401) {
            return { kind: 'invalid-credentials' };
        }
        else {
            return { kind: 'server-unavailable' };
        }
    }
    catch (e) {
        return { kind: 'server-unavailable' };
    }
}
