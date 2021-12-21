export const findTest = (component, testName) => {
    return component.find(`[data-test='${testName}']`);
};