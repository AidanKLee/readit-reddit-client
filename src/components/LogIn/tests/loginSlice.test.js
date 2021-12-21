import loginReducer from '../loginSlice';

describe('Login Reducer', () => {

    it('should return default state', () => {
        const newState = loginReducer(undefined, {});
        expect(newState).toEqual({});
    });

});