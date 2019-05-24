import { LOGIN_SUCCESS, LOGOUT_SUCCESS } from '../constants/actions';

export default (state: object, action: any) => {
    switch (action.type) {
        case LOGIN_SUCCESS:
            return {
                ...state,
                auth: true
            }

        case LOGOUT_SUCCESS:
            return {
                ...state,
                auth: false
            }

        default:
            return state;
    }
}