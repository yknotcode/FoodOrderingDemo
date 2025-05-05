//  ----  START OF SESSION ----
// Declare Variables
let showOrderObjectList = {};
let showOrderDetails = {};
let incompleteOrders = {};
let incompleteOrdersFinalList = {};

// save first order number in sessionStorage
let orderNumber = 0;
let storedOrder = [];
sessionStorage.setItem("orderNumber", 0);

// ----- ADDING ORDERS --------
//  On click of button
document
  .getElementById("btnMainIngredient")
  .addEventListener("click", mainIngredient);
function mainIngredient(callback) {
  //  Declare variable
  let userIngredient = prompt("Please provide your main ingredient");
  //let showOrderObjectList ={};

  //  Convert userIngredient to lowercase
  userIngredient = userIngredient.toLowerCase();
  //  Replace space in uerIngredient with underscore
  userIngredient = userIngredient.replace(" ", "_");
  // fetch the API result
  fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?i=${userIngredient}`
  )
    // Parse the result as a JSON object
    .then((res) => res.json())
    // Callback used to parse the data
    .then((result) => {
      // Check if JS response is empty
      if (result.meals === null) {
        alert(
          `No recipes found with ${userIngredient} as an ingredient.  Please try another ingredient`
        );
      } else {
        // Assign and store the data in the apiResult array
        apiRecipes = result;
        meals = result.meals;
        const index = Math.floor(Math.random() * meals.length - 1 + 1);
        const randomMeal = meals[index].strMeal;
        // Generate unique order number
        orderNumber = parseInt(sessionStorage.getItem("orderNumber"), 10);
        orderNumber = orderNumber + 1;

        //  -----   STORING ORDERS ----
        // declare order details
        let newStoredOrder = {
          orderNr: orderNumber,
          completionStatus: "incomplete",
          description: randomMeal,
        };
        //  get previously stored items from SessionStorage
        if (sessionStorage.storedOrder) {
          storedOrder = JSON.parse(sessionStorage.getItem("storedOrder"));
        } else {
          storedOrder = [];
        }
        storedOrder.push(newStoredOrder);
        // convert the order object into a string and store
        sessionStorage.setItem("storedOrder", JSON.stringify(storedOrder));

        //  Store the order number again after incremented
        sessionStorage.setItem("orderNumber", orderNumber);
        console.log(sessionStorage.getItem("orderNumber"));

        // Display orders
        let storedOrderString = sessionStorage.getItem("storedOrder");
        let storedOrderObject = JSON.parse(storedOrderString);
        let showOrderDetails = storedOrderObject.map((item) => {
          let showOrderObjectList = {};
          showOrderObjectList.onr = item.orderNr;
          showOrderObjectList.desc = item.description;
          return showOrderObjectList;
          return showOrderDetails;
        });
        // Configure array to only include fields order number and description
        return randomMeal;
      }
    })
    .catch((error) => console.error("Fetch error:", error));
}
//  On click of button 'Complete orders'
document
  .getElementById("btnOrderStatus")
  .addEventListener("click", completeOrders);
function completeOrders(callback) {
  let displayIncompleteOrders = {};
  let displayIncompleteOrderString = {};
  // get stored information from sessionStorage
  let storedOrderString = sessionStorage.getItem("storedOrder");
  let storedOrderObject = JSON.parse(storedOrderString);

  // filter all incomplete orders
  incompleteOrders = storedOrderObject.filter(function (orders) {
    return orders.completionStatus === "incomplete";
  });
  // mapped required fields

  const filteredIncompleteOrders = incompleteOrders.map((item) => {
    return `'\n'Order#: ${item.orderNr} - Dish: ${item.description} `;
  });
  let markOrderComplete = prompt(
    `These are the incomplete orders ${filteredIncompleteOrders}, '\n'please enter the order number if the order is complete, alternatively enter zero`
  );
  //  Check if the value provided in the prompt is an existing order number
  //  set a flag to break loop early
  let checkExist = false;
  // break loop early if criteria is met
  for (let i = 0; i < storedOrderObject.length; i++) {
    if (checkExist === true) {
      break;
    }
    if (parseInt(markOrderComplete) === storedOrderObject[i].orderNr) {
      storedOrderObject[i].completionStatus = "completed";
      // convert the order object into a string and store
      sessionStorage.setItem("storedOrder", JSON.stringify(storedOrderObject));
      checkExist = true;
    } else if (parseInt(markOrderComplete) === 0) {
      checkExist = true;
    }
  }

  if (checkExist === false) {
    alert(
      "the order number you provided does not exist, try another order number"
    );
  }
}
