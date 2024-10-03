class UserNotFoundError extends Error {
    get message() {
        return "User Not Found";
    }
    get name() {
        return "UserNotFoundError";
    }
}

class UserAlreadyExistsError extends Error {
    get message() {
        return "User already exists";
    }
    get name() {
        return "UserAlreadyExistsError";
    }
}

class InvalidUserError extends Error {
    constructor(message) {
        super(message);
    }
    get message() {
        return "Invalid User";
    }
    get name() {
        return "InvalidUserError";
    }
}

class UserInputError extends Error {
    constructor(message) {
        super(message);
    }
    get message() {
        return "Invalid User Input";
    }
    get name() {
        return "UserInputError";
    }
}

module.exports={UserNotFoundError,
    UserAlreadyExistsError,
    InvalidUserError,

    UserInputError,
    }
    
