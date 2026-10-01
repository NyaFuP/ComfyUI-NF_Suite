"""Error types shared by the suite. Each maps to an HTTP status and an API error code."""


class NFError(Exception):
    status = 500
    default_code = "INTERNAL_ERROR"

    def __init__(self, message, code=None, details=None):
        super().__init__(message)
        self.message = message
        self.code = code or self.default_code
        self.details = details

    def to_dict(self):
        error = {"code": self.code, "message": self.message}
        if self.details is not None:
            error["details"] = self.details
        return {"error": error}


class BadRequest(NFError):
    status = 400
    default_code = "BAD_REQUEST"


class NotFound(NFError):
    status = 404
    default_code = "NOT_FOUND"


class Conflict(NFError):
    status = 409
    default_code = "CONFLICT"


class InvalidData(NFError):
    status = 422
    default_code = "INVALID_DATA"


class StorageCorrupt(NFError):
    """The stored file cannot be parsed or validated. Writes must be refused."""

    status = 503
    default_code = "STORAGE_CORRUPT"
