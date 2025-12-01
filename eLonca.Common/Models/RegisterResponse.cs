namespace eLonca.Common.Models
{
    public class RegisterResponse
    {
        public object? Tenant { get; set; }
        public object? User { get; set; }
        public object? Store { get; set; }
        public string? Message { get; set; }
        public bool IsSuccess { get; set; }
    }
}
