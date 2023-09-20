AFRAME.registerComponent("create-markers", {
  init: async function() {
    var mainScene = document.querySelector("#main-scene")
    //get the toys collection from firestore database
    var toys = await this.getToys()
   
    toys.map(Toy => {
      var marker = document.createElement("a-marker")   
      marker.setAttribute("id", Toy.id)
      marker.setAttribute("type", "pattern")
      marker.setAttribute("url", Toy.marker_pattern_url)
      marker.setAttribute("cursor", {
        rayOrigin: "mouse"
      })

      //set the markerhandler component
      marker.setAttribute("markerhandler", {})
      mainScene.appendChild(marker)

      // Getting today's day
      var todaysDate = new Date()
      var todaysDay = todaysDate.getDay()
      // Sunday - Saturday : 0 - 6
      var days = [
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday"
      ]

      if (!dish.unavailable_days.includes(days[todaysDay])) {

        // Adding 3D model to scene
        var model = document.createElement("a-entity")    
      
        model.setAttribute("id", `model-${Toy.id}`)
        model.setAttribute("position", Toy.model_geometry.position)
        model.setAttribute("rotation", Toy.model_geometry.rotation)
        model.setAttribute("scale", Toy.model_geometry.scale)
        model.setAttribute("gltf-model", `url(${Toy.model_url})`)
        model.setAttribute("gesture-handler", {})
        model.setAttribute("visible", false)
        marker.appendChild(model)

        // description Container
        var mainPlane = document.createElement("a-plane")
        mainPlane.setAttribute("id", `main-plane-${Toy.id}`)
        mainPlane.setAttribute("position", { x: 0, y: 0, z: 0 })
        mainPlane.setAttribute("rotation", { x: -90, y: 0, z: 0 })
        mainPlane.setAttribute("width", 1.7)
        mainPlane.setAttribute("height", 1.5)
        mainPlane.setAttribute("visible", false)
        marker.appendChild(mainPlane)

        // Toy title background plane
        var titlePlane = document.createElement("a-plane")
        titlePlane.setAttribute("id", `title-plane-${Toy.id}`)
        titlePlane.setAttribute("position", { x: 0, y: 0.89, z: 0.02 })
        titlePlane.setAttribute("rotation", { x: 0, y: 0, z: 0 })
        titlePlane.setAttribute("width", 1.69)
        titlePlane.setAttribute("height", 0.3)
        titlePlane.setAttribute("material", { color: "#F0C30F" })
        mainPlane.appendChild(titlePlane)

        // Toy title
        var ToyTitle = document.createElement("a-entity")
        ToyTitle.setAttribute("id", `Toy-title-${Toy.id}`)
        ToyTitle.setAttribute("position", { x: 0, y: 0, z: 0.1 })
        ToyTitle.setAttribute("rotation", { x: 0, y: 0, z: 0 })
        ToyTitle.setAttribute("text", {
          font: "monoid",
          color: "black",
          width: 1.8,
          height: 1,
          align: "center",
          value: Toy.Toy_name.toUpperCase()
        })
        titlePlane.appendChild(ToyTitle)

        // description List
        var description = document.createElement("a-entity")
        description.setAttribute("id", `description-${Toy.id}`)
        description.setAttribute("position", { x: 0.3, y: 0, z: 0.1 })
        description.setAttribute("rotation", { x: 0, y: 0, z: 0 })
        description.setAttribute("text", {
          font: "monoid",
          color: "black",
          width: 2,
          align: "left",
          value: `${Toy.description}`
        })
        mainPlane.appendChild(description)

        //Plane to show the price of the dish
        var pricePlane = document.createElement("a-image");
        pricePlane.setAttribute("id", `price-plane-${dish.id}`);
        pricePlane.setAttribute(
          "src",
          "https://raw.githubusercontent.com/whitehatjr/menu-card-app/main/black-circle.png"
        );
        pricePlane.setAttribute("width", 0.8);
        pricePlane.setAttribute("height", 0.8);
        pricePlane.setAttribute("position", { x: -1.3, y: 0, z: 0.3 });
        pricePlane.setAttribute("rotation", { x: -90, y: 0, z: 0 });
        pricePlane.setAttribute("visible", false)

        //Price of the dish
        var price = document.createElement("a-entity");
        price.setAttribute("id", `price-${dish.id}`);
        price.setAttribute("position", { x: 0.03, y: 0.05, z: 0.1 });
        price.setAttribute("rotation", { x: 0, y: 0, z: 0 });
        price.setAttribute("text", {
          font: "mozillavr",
          color: "white",
          width: 3,
          align: "center",
          value: `Only\n $${dish.price}`
        });

        pricePlane.appendChild(price);
        marker.appendChild(pricePlane);
      }
    })
  },
  //function to get the toys collection from firestore database
  getToys: async function() {
    return await firebase
      .firestore()
      .collection("toys")
      .get()
      .then(snap => {
        return snap.docs.map(doc => doc.data())
      })
  }
})
