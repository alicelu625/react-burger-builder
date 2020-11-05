export const updateObject = (oldObject, updatedProperties) => {
    return {
        ...oldObject,
        ...updatedProperties
    }
};

//check if form is valid
export const checkValidity = (value, rules) => {
    let isValid = true;

    /*alternative to checking if element has validation rules (dropdown doesn't)
    //element is valid if no validation rules
    if (!rules) {
        return true;
    }*/

    //if empty string, then isValid is false
    if (rules.required) {
        isValid = value.trim() !== '' && isValid; //trim white spaces
    }
    //check minimum length
    if (rules.minLength) {
        isValid = value.length >= rules.minLength && isValid;
    }
    //check max length
    if (rules.maxLength) {
        isValid = value.length <= rules.maxLength && isValid;
    }
    return isValid;
}