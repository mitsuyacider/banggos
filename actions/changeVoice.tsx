import { VOICE_CHANGE } from '../constants';
export function changeVoice(flag) {
    return {
        type: VOICE_CHANGE,
        payload: flag
    }
}