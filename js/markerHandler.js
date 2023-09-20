var houseNumber = null

AFRAME.registerComponent("markerhandler", {
  init: async function () {

    if (tableNumber == null) {
      this.askTableNumber();
    }

    //get the toys collection from firestore database
    var toys = await this.getToys()

    //markerFound event
    this.el.addEventListener("markerFound", () => {
      var markerId = this.el.id      
      this.handleMarkerFound(toys, markerId)
    })

    //markerLost event
    this.el.addEventListener("markerLost", () => {
      this.handleMarkerLost()
    })

  },

  askTableNumber: function() {
    var iconUrl = "https://raw.githubusercontent.com/ElectroFast5/Pro-170/main/pattern-Train%202.png"

    swal({
      title: "Welcome to ExpensiveToys",
      icon: iconUrl,
      content: {
        element: "input",
        attributes : {
          placeholder: "Please type your table number",
          type: "number",
          min: 1
        }
      },
      closeOnClickOutside: false,
    }).then((x)=>{
      tableNumber = x
    })
  },

  handleMarkerFound: function (toys, markerId) {
    // Getting today's day
    var todaysDate = new Date();
    var todaysDay = todaysDate.getDay();
    
    // Sunday - Saturday : 0 - 6
    var days = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday"
    ];

    var toy = toys.filter(toy => toy.id === markerId)[0];

    if (toy.unavailable_days.includes(days[todaysDay])) {
      swal({
        icon: "warning",
        title: toy.toy_name.toUpperCase(),
        text: "This toy is not available today!!!",
        timer: 2500,
        buttons: false
      });
    } else {
       // Changing Model scale to initial scale
      var model = document.querySelector(`#model-${toy.id}`);
      model.setAttribute("position", toy.model_geometry.position);
      model.setAttribute("rotation", toy.model_geometry.rotation);
      model.setAttribute("scale", toy.model_geometry.scale);

      //Update UI conent VISIBILITY of AR scene(MODEL , INGREDIENTS & PRICE)
      model.setAttribute("visible", true)

      var ingredientsContainer = document.querySelector(`#main-plane-${toy.id}`)
      ingredientsContainer.setAttribute("visible", true)

      var price = document.querySelector(`#price-plane-${toy.id}`)
      price.setAttribute("visible", true)

      // Changing button div visibility
      var buttonDiv = document.getElementById("button-div");
      buttonDiv.style.display = "flex";

      var ratingButton = document.getElementById("rating-button");
      var orderButtton = document.getElementById("order-button");

      // Handling Click Events
      ratingButton.addEventListener("click", function() {
        swal({
          icon: "warning",
          title: "Rate Toy",
          text: "Work In Progress"
        });
      });

      orderButtton.addEventListener("click", () => {
        var tNumber
        tableNumber<=9?(tNumber=`T0${tableNumber}`):`T${tableNumber}`
        this.handleOrder(tNumber, toy)

        swal({
          icon: "https://i.imgur.com/4NZ6uLY.jpg",
          title: "Thanks For Order !",
          text: "Your order will serve soon on your table!",
          timer: 2000,
          buttons: false
        });
      });
    }
  },
  handleOrder: function(tNumber, toy) {
    firebase.firestore().collection("orders").doc(tNumber).get().then((doc)=> {
      var details = doc.data()
      if(details["current_basket"][toy.id]){
        details["current_basket"][toy.id]["quantity"]+=1
        var currentQuatity = details["current_basket"][toy.id]["quantity"]
        details["current_basket"][toy.id]["subtotal"] = currentQuatity * toy.price
      } else{
        details["current_basket"][toy.id] = {
          item: toy.toy_name,
          price: toy.price,
          quantity: 1,
          subtotal: toy.price
        }
      }
      details.total_bill += toy.price
      firebase.firestore().collection("tables").doc(doc.id).update(details)
    })
  },

  handleMarkerLost: function () {
    // Changing button div visibility
    var buttonDiv = document.getElementById("button-div")
    buttonDiv.style.display = "none"
  },
  //get the toys collection from firestore database
  getToys: async function () {
    return await firebase
      .firestore()
      .collection("toys")
      .get()
      .then(snap => {
        return snap.docs.map(doc => doc.data())
      })
  }
})
