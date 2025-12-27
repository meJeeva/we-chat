
export const loggerMiddleware = (store) => (next) => (action) => {
    console.log('Prev State:', store.getState());
    console.log('Dispatching:', action);

    const result = next(action);

    console.log('Next State:', store.getState());
    return result;
};
