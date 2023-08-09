export const httpError = ({
    response,
    statusCode,
    message,
}) => {
    switch (statusCode) {
        case 400:
            return response.status(400).send({ message: message || "Bad Request" });
        case 401:
            return response.status(401).send({ message: message || "Unauthorized" });
        case 402:
            return response.status(402).send({ message: message || "invalid License" });
        case 403:
            return response.status(403).send({ message: message || "Forbidden" });
        case 404:
            return response.status(404).send({ message: message || "Not Found" });
        case 500:
            return response.status(500).send({ message: message || "Server Error" });
    }
};
