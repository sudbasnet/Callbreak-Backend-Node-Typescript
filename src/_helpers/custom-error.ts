// module.exports = (message: string, status: number, details: string) => {
//     const error = new Error(message);
//     error.status = status;
//     error.details = details;
//     return error;
// }

class CustomError extends Error {
    constructor(
        public message: string,
        public status: number,
        public details: string = ""
    ) {
        super(message);
    }
};

export default CustomError;