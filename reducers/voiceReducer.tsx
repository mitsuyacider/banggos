import { VOICE_CHANGE } from '../constants';
const initialState = {
    hasVoice: false
};
const voiceReducer = (state = initialState, action) => {
    switch (action.type) {
        case VOICE_CHANGE:
            return {
                ...state,
                hasVoice: action.payload
            };
        default:
            return state;
    }
}
export default voiceReducer;