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