import { createStore, combineReducers } from 'redux';
import voiceReducer from '../reducers/voiceReducer';
const rootReducer = combineReducers(
    { hasVoice: voiceReducer }
);
const configureStore = () => {
    return createStore(rootReducer);
}
export default configureStore;