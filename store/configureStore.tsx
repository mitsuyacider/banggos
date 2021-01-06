import { createStore, combineReducers } from 'redux';
import voiceReducer from '../reducers/voiceReducer';
const rootReducer = combineReducers(
    { hasVoice: voiceReducer }
);
const configureStore = () => {
    return createStore(voiceReducer);

    // NOTE: If use this, it returns a nested object.
    // return createStore(rootReducer);
}
export default configureStore;
// export default voiceReducer;