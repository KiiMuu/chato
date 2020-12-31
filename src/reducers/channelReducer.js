import * as actionTypes from '../actions/types';

const initialChannelState = {
    currentChannel: null
}

const channelReducer = (state = initialChannelState, action) => {
    switch (action.type) {
        case actionTypes.SET_CURRENT_CHANNEL:
            return {
                ...state,
                currentChannel: action.payload.currentChannel
            }
        default:
            return state;
    }
}

export default channelReducer;