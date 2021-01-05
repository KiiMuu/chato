import * as actionTypes from '../actions/types';

const initialChannelState = {
    currentChannel: null,
    isPrivateChannel: false,
    userMessages: null
}

const channelReducer = (state = initialChannelState, action) => {
    switch (action.type) {
        case actionTypes.SET_CURRENT_CHANNEL:
            return {
                ...state,
                currentChannel: action.payload.currentChannel
            }
        case actionTypes.SET_PRIVATE_CHANNEL:
            return {
                ...state,
                isPrivateChannel: action.payload.isPrivateChannel
            }
        case actionTypes.SET_USER_MESSAGES:
            return {
                ...state,
                userMessages: action.payload.userMessages
            }
        default:
            return state;
    }
}

export default channelReducer;