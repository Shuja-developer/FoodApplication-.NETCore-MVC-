namespace FoodApplication.Models
{
    public class OrderRecipeDetails
    {
        public string? Id { get; set; }
        public string? Cooking_time { get; set; }
        public string? Image_url { get; set; }
        public string? Publisher { get; set; }
        public string? Title { get; set; }
        public List<ingredient> ingredients { get; set; }
        public OrderRecipeDetails()
        {
            ingredients = new List<ingredient>();
        }
    }
    public class ingredient
    {
        public string? Description { get; set; }
        public string? Quantity { get; set; }
        public string? Unit { get; set; }
      
    }
}
