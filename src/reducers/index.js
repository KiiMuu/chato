import { combineReducers } from 'redux';

import userReducer from './userReducer';
import channelReducer from './channelReducer';

const rootReducer = combineReducers({
    user: userReducer,
    channel: channelReducer
});

export default rootReducer;