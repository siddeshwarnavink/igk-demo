
const validateProfile = (values: any) => {
    let errors: any = {};

    // Username
    if (!values.displayName) {
        errors.displayName = "Username required!";
    } else if (values.displayName.length < 3) {
        errors.displayName = "Username must be at least 3 characters";
    }
    
    return errors;
}


export default validateProfile;