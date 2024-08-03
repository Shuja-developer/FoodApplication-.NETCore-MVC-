const apiURL = "https://forkify-api.herokuapp.com/api/v2/recipes";
const apikey = "84db04dc-141a-4d2f-b0d6-9c100e3f8e4e";


async function GetRecipes(recipename, id, isAllShow) {
    try {
        let resp = await fetch(`${apiURL}?search=${recipename}&key=${apikey}`);
        if (!resp.ok) {
            throw new Error(`HTTP error! status: ${resp.status}`);
        }
        let result = await resp.json();
        let Recipes = isAllShow ? result.data.recipes : result.data.recipes.slice(1, 7);
        showRecipes(Recipes, id);
    } catch (error) {
        console.error('Error fetching recipes:', error);
    }
}

function showRecipes(recipes, id) {
    $.ajax({
        contentType: "application/json; charset=utf-8",
        dataType: 'html',
        type: 'POST',
        url: '/Recipe/GetRecipeCard', 
        data: JSON.stringify(recipes),
        success: function (htmlResult) {
            $('#' + id).html(htmlResult);
            GetAddedCarts();
        },
    });
}

$(document).ready(function () {
    GetRecipes("pizza", "pizzaRecipe", false);
});

async function getOrderRecipe(id, showId) {
    let resp = await fetch(`${apiURL}/${id}?key=${apikey}`);
    let result = await resp.json();
    let recipe = result.data.recipe;
    showOrderRecipeDetails(recipe, showId);
}
function showOrderRecipeDetails(OrderRecipeDetails, showId) {
    $.ajax({
        url: '/Recipe/ShowOrder',
        data: OrderRecipeDetails,
        dataType: 'html',
        type: 'POST',
        success: function (htmlResult) {
            $('#' + showId).html(htmlResult);
        },
       
    });
}

//order page
function quantity(options) {
    let qty = $('#qty').val();
    let price = parseInt($('#price').val());
    let totalAmount = 0;
    if (options === 'inc') {
        qty = parseInt(qty) + 1;
    }
    else {
        qty = qty == 1 ? qty : qty - 1;
    }
    totalAmount = price * qty;
    $('#qty').val(qty);
    $('#totalAmount').val(totalAmount)
}
//add to cart
 async function cart() {
    let iTag = $(this).children('i')[0];
    let recipeId = $(this).attr('data-recipeId');
    if ($(iTag).hasClass('fa-regular')) {
        let resp = await fetch(`${apiURL}/${recipeId}?key=${apikey}`);
        let result = await resp.json();
        let cart = result.data.recipe;
        cart.RecipeId = recipeId;
        delete cart.id;

        cartRequest(cart, 'SaveCart', 'fa-solid','fa-regular', iTag, false);
     }
    else {
        let data = { Id: recipeId };

        cartRequest(data, 'RemoveCartFromList', 'fa-solid', 'fa-regular', iTag, false);

    }
}
function cartRequest(data, action, addCls, removeCls, iTag, isReload) {
    $.ajax({
        url: '/Cart/' + action,
        type: 'POST',
        data: data,
        success: function (resp) {
            if (isReload) {
                location.reload();
            }
            else {
                $(iTag).addClass(addCls);
                $(iTag).removeClass(removeCls);
            }
            
        },
        error: function (err) {
            console.log(err);
        }
    });

}
        
function GetAddedCarts() {
    $.ajax({
        url: '/Cart/GetAddedCarts',
        type: 'GET',
        dataType: 'json',
        success: function (result) {
            $('.addToCartIcon').each((index, spanTag) => {
                let recipeId = $(spanTag).attr(" data-recipeId");
                for (var i = 0; i < result.length; i++) {
                    if (recipeId == result[i]) {
                        let itag = $(spanTag).children('i')[0];
                        $(itag).addClass('fa-solid');
                        $(itag).removeClass('fa-regular');
                        break;
                    }
                }
            })
        },
        error: function (err) {
            console.log(err);
        }
    });
}
function getCartList() {
    $.ajax({
        url: '/Cart/GetCartList',
        type: 'GET',
        dataType: 'html',
        success: function (result) {
            $('#showCartList').html(result);

         },
        error: function (err) {
            console.log(err);
        }
    });
}
function removeCartfromlist(id) {
    let data = {Id : id};
    cartRequest(data, 'RemoveCartFromList', null, null, null, true);
}

