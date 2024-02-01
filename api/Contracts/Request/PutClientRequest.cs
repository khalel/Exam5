using System.ComponentModel.DataAnnotations;

namespace api.Contracts.Request
{
    public class PutClientRequest
    {
        [Required]
        public string Id { get; set; }
        [Required]
        public string FirstName { get; set; }
        [Required]
        public string LastName { get; set; }
        [Required]
        public string Email { get; set; }
        [Required]
        public string PhoneNumber { get; set; }
    }
}
