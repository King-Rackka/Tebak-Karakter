const PLAYER_ID_KEY = 'tk_player_id';
const NICKNAME_KEY = 'tk_nickname';
const ROOM_CODE_KEY = 'tk_active_room';

export function getPlayerId() {
    let id = localStorage.getItem(PLAYER_ID_KEY);
    if (!id) {
        id = (crypto?.randomUUID ? crypto.randomUUID() : `p-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`);
        localStorage.setItem(PLAYER_ID_KEY, id);
    }
    return id;
}

export function getSavedNickname() {
    return localStorage.getItem(NICKNAME_KEY) || '';
}

export function saveNickname(name) {
    localStorage.setItem(NICKNAME_KEY, name);
}

export function getSavedRoomCode() {
    return localStorage.getItem(ROOM_CODE_KEY) || '';
}

export function saveRoomCode(code) {
    if (code) {
        localStorage.setItem(ROOM_CODE_KEY, code);
    } else {
        localStorage.removeItem(ROOM_CODE_KEY);
    }
}

async function request(path, options = {}) {
    const res = await fetch(`/api${path}`, {
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            ...(options.headers || {}),
        },
        ...options,
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
        throw new Error(data.message || 'Terjadi kesalahan pada server.');
    }
    return data;
}

export const api = {
    getThemes: () => request('/themes'),
    createRoom: (payload) => request('/rooms', { method: 'POST', body: JSON.stringify(payload) }),
    joinRoom: (code, payload) => request(`/rooms/${encodeURIComponent(code)}/join`, { method: 'POST', body: JSON.stringify(payload) }),
    getState: (code, playerId) => request(`/rooms/${encodeURIComponent(code)}?playerId=${encodeURIComponent(playerId)}`),
    updateSettings: (code, payload) => request(`/rooms/${encodeURIComponent(code)}/settings`, { method: 'PATCH', body: JSON.stringify(payload) }),
    startGame: (code, playerId) => request(`/rooms/${encodeURIComponent(code)}/start`, { method: 'POST', body: JSON.stringify({ playerId }) }),
    submitGuess: (code, playerId, guess) => request(`/rooms/${encodeURIComponent(code)}/guess`, { method: 'POST', body: JSON.stringify({ playerId, guess }) }),
    skipRound: (code, playerId) => request(`/rooms/${encodeURIComponent(code)}/skip`, { method: 'POST', body: JSON.stringify({ playerId }) }),
    nextRound: (code, playerId) => request(`/rooms/${encodeURIComponent(code)}/next-round`, { method: 'POST', body: JSON.stringify({ playerId }) }),
    playAgain: (code, playerId) => request(`/rooms/${encodeURIComponent(code)}/play-again`, { method: 'POST', body: JSON.stringify({ playerId }) }),
    leaveRoom: (code, playerId) => request(`/rooms/${encodeURIComponent(code)}/leave`, { method: 'POST', body: JSON.stringify({ playerId }) }),
};
