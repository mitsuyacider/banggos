import { VOICE_CHANGE } from '../constants';
export function changeVoice(flag) {
    console.log('*** changevoice')
    return {
        type: VOICE_CHANGE,
        payload: flag
    }
}