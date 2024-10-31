

class PhotoAlreadyExistsError extends Error {
    get message() {
        return "Photo already exists";
    }
    get name() {
        return "PhotoAlreadyExistsError";
    }
}

class PhotoDoesntExistError extends Error {
    get message() {
        return "Photo does not exist";
    }
    get name() {
        return "PhotoDoesntExistError";
    }
}

module.exports={
    PhotoAlreadyExistsError,
    PhotoDoesntExistError
}
    
