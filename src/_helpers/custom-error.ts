class CustomError extends Error {
    constructor(
        public message: string,
        public status: number,
        public details: any = null
    ) {
        super(message);
    }
};

export default CustomError;