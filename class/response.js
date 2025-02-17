class Response {
    constructor(res) {
        this.res = res;
    }
    
    success(data = {}, message = "Fetched Successfully", statusCode = 200) {
        this.res.status(statusCode).json({
            status: 1,
            message,
            data,
        });
    }

    error(data = {}, message = "An error occurred", statusCode = 400) {
        this.res.status(statusCode).json({
            status: 0,
            message,
            error: data,
        });
    }
}

export default Response;