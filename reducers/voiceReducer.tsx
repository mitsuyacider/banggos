import { VOICE_CHANGE, THRESHOLD_CHANGE } from '../constants';
const initialState = {
    hasVoice: false,
};
const voiceReducer = (state = initialState, action) => {
    switch (action.type) {
        case VOICE_CHANGE:
            return {
                ...state,
                hasVoice: action.payload
            };

        case THRESHOLD_CHANGE:
            console.log('******', action.payload)
            return {
                ...state,
                inputText: action.payload
            }
        default:
            return state;
    }

    return state
}
export default voiceReducer;