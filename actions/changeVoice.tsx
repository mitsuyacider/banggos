import { VOICE_CHANGE, THRESHOLD_CHANGE } from '../constants';
export function changeVoice(flag) {
    return {
        type: VOICE_CHANGE,
        payload: flag
    }
}


export function changeThreshold(value) {
    return {
        type: THRESHOLD_CHANGE,
        payload: value
    }
}

