namespace eLonca.Common.Models
{
    public class Result<T>
    {
        public bool IsSuccess { get; set; }
        public T? Data { get; set; }
        public string Message { get; set; }
        public List<string> Errors { get; set; } = new();
        public int StatusCode { get; set; }

        public static Result<T> Success(T data, string message, int statusCode)
        {
            return new()
            {
                IsSuccess = true,
                Data = data,
                Message = message,
                StatusCode = statusCode
            };
        }
        public static Result<T> Failure(List<string> errors, string message, int statusCode)
        {
            return new()
            {
                IsSuccess = false,
                Message = message,
                StatusCode = statusCode,
                Errors = errors ?? new List<string>(),
            };
        }

    }

    public class Result
    {
        public bool IsSuccess { get; set; }
        public string Message { get; set; }
        public List<string> Errors { get; set; }
        public int StatusCode { get; set; }

        public static Result Success(string message, int statusCode)
        {
            return new()
            {
                IsSuccess = true,
                Message = message,
                StatusCode = statusCode
            };
        }

        public static Result Failure(string message, List<string>? errors, int statusCode)
        {
            return new()
            {
                IsSuccess = false,
                Message = message,
                Errors = errors ?? new List<string>(),
                StatusCode = statusCode
            };
        }
    }
}
