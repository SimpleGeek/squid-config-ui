export default class Util {
    constructor() {}

    removeElementFromArray(array, index) {
        array[index] = array[array.length - 1];
        array.pop();
        return array;
    }

    checkIfElementExistsInArray(array, element, elementValueRetriever) {
        let index = null;
        for (let i = 0; i < array.length; i++) {
            if (elementValueRetriever(element) == elementValueRetriever(array[i])) {
                index = i;
                break;
            }
        }
        return index;
    }
}