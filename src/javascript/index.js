var shoppingCart = (function () {
  cart = [
    {
      name: "Lorem ipsum",
      count: 1,
      price: 198.99,
      img: "src/images/product-thumbnail.jpg",
    },
    {
      name: "Lorem ipsum dolor",
      count: 1,
      price: 155.22,
      img: "src/images/product-thumbnail.jpg",
    },
    {
      name: "Lorem ipsum dolor summit",
      count: 1,
      price: 12.5,
      img: "src/images/product-thumbnail.jpg",
    },
    {
      name: "Lorem ipsum summit",
      count: 1,
      price: 199,
      img: "src/images/product-thumbnail.jpg",
    },
  ];

  saveCart();

  // Save cart
  function saveCart() {
    sessionStorage.setItem("shoppingCart", JSON.stringify(cart));
  }

  // Load cart
  function loadCart() {
    cart = JSON.parse(sessionStorage.getItem("shoppingCart"));
  }

  if (sessionStorage.getItem("shoppingCart") != null) {
    loadCart();
  }

  var cartObj = {};

  // Add to cart
  cartObj.addItemToCart = function (name) {
    for (let item in cart) {
      if (cart[item].name === name) {
        cart[item].count++;
        saveCart();
        return;
      }
    }
  };
  // Set count from item
  cartObj.setCountForItem = function (name, count) {
    for (let i in cart) {
      if (cart[i].name === name) {
        cart[i].count = count;
        break;
      }
    }
  };
  // Remove item from cart
  cartObj.removeItemFromCart = function (name) {
    for (let item in cart) {
      if (cart[item].name === name) {
        cart[item].count--;
        if (cart[item].count === 0) {
          cart.splice(item, 1);
        }
        break;
      }
    }
    saveCart();
  };

  // Remove all items from cart
  cartObj.removeItemFromCartAll = function (name) {
    for (let item in cart) {
      if (cart[item].name === name) {
        cart.splice(item, 1);
        break;
      }
    }
    saveCart();
  };

  // Count cart
  cartObj.totalCount = function () {
    let totalCount = 0;
    for (let item in cart) {
      totalCount += cart[item].count;
    }
    return totalCount;
  };

  // Subtotal cart
  cartObj.subtotal = function () {
    let subtotal = 0;
    for (let item in cart) {
      subtotal += cart[item].price * cart[item].count;
    }
    return Number(subtotal.toFixed(2));
  };

  // Total Vat
  cartObj.totalVat = function () {
    let totalVat = (this.subtotal() * 20) / 100;
    return Number(totalVat.toFixed(2));
  };

  // List cart
  cartObj.listCart = function () {
    let cartCopy = [];
    for (i in cart) {
      item = cart[i];
      itemCopy = {};
      for (p in item) {
        itemCopy[p] = item[p];
      }
      itemCopy.total = Number(item.price * item.count).toFixed(2);
      cartCopy.push(itemCopy);
    }
    return cartCopy;
  };
  cartObj.submitCart = function (elem) {
    const apiUrl = "https://domain.com/postcart";
    let cartData = {
      cart: cart,
      subtotal: this.subtotal(),
      totalvat: this.totalVat(),
      totalCost: Number(this.subtotal() + this.totalVat()).toFixed(2)
    }
    $.ajax({
      url: apiUrl,
      type: "POST",
      data: JSON.stringify(cartData),
      contentType: "application/json",
      success: function (result) {
        console.log(result);
        elem.removeClass( "loader" );
        alert("order placed")
      },
      error: function (error) {
        console.log(`Error ${error}`);
        elem.removeClass( "loader" );
      },
    });
    setTimeout(function(){
        elem.removeClass( "loader" );
        alert("order placed")
    },2000)
  };
  return cartObj;
})();

// Display cart item
function displayCart() {
  let cartArray = shoppingCart.listCart(),
    output = "";
  if (cartArray.length) {
    $('#buynow').prop('disabled', false);
  }else{
    $('#buynow').prop('disabled', true);
  }
  for (var i in cartArray) {
    output += `<div class="table-row">
      <div class="table-col"><img src="${cartArray[i].img}" alt="${
      cartArray[i].name
    }" /></div> 
      <div class="table-col">
        <label class="name">${cartArray[i].name}</label>
        <label>$ ${cartArray[i].price}</label>
        <select name="select${i}" class="item-count" data-name="${
      cartArray[i].name
    }">
          <option value="0" ${
            cartArray[i].count === 0 ? "selected" : ""
          }>0</option>
          <option value="1" ${
            cartArray[i].count === 1 ? "selected" : ""
          }>1</option>
          <option value="2" ${
            cartArray[i].count === 2 ? "selected" : ""
          }>2</option>
          <option value="3" ${
            cartArray[i].count === 3 ? "selected" : ""
          }>3</option>
          <option value="4" ${
            cartArray[i].count === 4 ? "selected" : ""
          }>4</option>
          <option value="5" ${
            cartArray[i].count === 5 ? "selected" : ""
          }>5</option>
        </select>
      </div>
      <div class="table-col" data-label="Total Cost">$${cartArray[i].total}</div>
      <div class="table-col"><button class="delete-item" data-name="${
        cartArray[i].name
      }"><img src="src/images/delete-icon.png" alt="delete" /></button></div>
      </div>`;
  }
  $(".table-body").html(output);
  $(".subtotal").html(`$${shoppingCart.subtotal()}`);
  $(".totalvat").html(`$${shoppingCart.totalVat()}`);
  $(".cartotal").html(`$${Number(shoppingCart.totalVat() + shoppingCart.subtotal()).toFixed(2)}`);
  $(".total-count").html(shoppingCart.totalCount());
}

// Delete item button
$("#itemTable").on("click", ".delete-item", function (event) {
  let name = $(this).data("name");
  shoppingCart.removeItemFromCartAll(name);
  displayCart();
});

// Item update
$("#itemTable").on("change", ".item-count", function (event) {
  let name = $(this).data("name"),
    count = Number($(this).val());
  shoppingCart.setCountForItem(name, count);
  displayCart();
});

// Buy Now
$("#buynow").click(function () {
  $(this).addClass("loader");
  shoppingCart.submitCart($(this));
});

displayCart();
