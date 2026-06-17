function init(){
  addEventListeners();
  getAPIData();
}

function addEventListeners(){
  document.getElementById("searchValue").addEventListener('keyup', function(){
    let filter = this.value.toLowerCase();
    let eventList = document.getElementById("resultTable").getElementsByTagName("tr");

    for(let i=0; i< eventList.length; i++){
      let event = eventList[i];
      if(event.textContent.toLowerCase().includes(filter)){ //matches search value (show)
        event.classList.remove('hidden');
      }
      else {  //does not match search value (don't show)
        event.classList.add('hidden');
      }
    }   
  });
}

async function getAPIData() {
  try {
    const response = await fetch("https://proxy.corsfix.com/?https://www.rvo.nl/api/v1/opendata/events");
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.json();

    //fill table with resulting data
    var idCounter = 1;
    const resultTable = document.getElementById("resultTable");
    result.forEach(item => {
      var countryNames = "";  //reset string
      var beginDates = "";
      var endDates = "";
      var numberOfCountries = item.countries.length - 1; //-1 because index starts at 0
      var numberOfDates = item.dates.length -1;
      
      //-------FUTURE: rewrite to use concatNames function for this
      //if more than one country, add together in 1 string
      item.countries.forEach(country =>{
        if(item.countries.indexOf(country) == numberOfCountries){ //if last country in list
          countryNames += country.name; //no final slash
        }
        else countryNames += country.name + " / ";
      })

      //if more than one date, add together in 1 string
      item.dates.forEach(date =>{
        if(item.dates.indexOf(date) == numberOfDates){ //if last date in list
          beginDates += date.value; 
          endDates += date.end_value;
        }
        else {
          beginDates += date.value + "</br> & </br>";
          endDates += date.end_value + "</br> & </br>";
        }
      })
      //-------------
      
      //fill table rows with data
      resultTable.innerHTML += "<tr><td>" + idCounter + "</td>" + 
                               "<td><a href='eventDetails.html?eventnumber=" + item.id + "'>" + item.title + "</a></td>" +
                               "<td>" + countryNames + "</td>" +
                               "<td>" + beginDates + "</td>" +
                               "<td>" + endDates + "</td></tr>"

      idCounter++; //up counter
    });
  } catch (error) {
    console.error(error.message);
  }
}

async function getEventData() {
  //------FUTURE: create global variable with json response data instead of loose calls
  try {
    const response = await fetch("https://proxy.corsfix.com/?https://www.rvo.nl/api/v1/opendata/events");
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.json();

    var url = window.location.href;
    var eventId = url.substring(url.lastIndexOf('=') + 1); //strip final part of url for id

    var eventItem = result.find(item => { //find correct event based on id 
      return item.id === eventId;
    })
  
    document.getElementById("eventName").innerHTML = eventItem.title;
    document.getElementById("eventIntro").innerHTML = eventItem.intro;
    document.getElementById("eventDates").innerHTML = concatNames(eventItem.dates, "dates");
    document.getElementById("eventCountries").innerHTML = concatNames(eventItem.countries, "names");
    document.getElementById("eventSectors").innerHTML = concatNames(eventItem.sectors, undefined);
    document.getElementById("eventTargets").innerHTML = concatNames(eventItem.targets, undefined);
    document.getElementById("eventTags").innerHTML = concatNames(eventItem.tags, undefined);

    var fullUrl = "https://www.rvo.nl" + eventItem.url;
    document.getElementById("eventUrl").innerHTML = "<a href=" + fullUrl + ">" + fullUrl + "</a>";    
  } catch (error) {
    console.error(error.message);
  }
}

//function to concatenate multiple objects into one string, if applicable
function concatNames(elementList, propertySelect){ 
  var resultingString = ""; //reset string
  var itemProperty;
  var separationsymbol = ", ";  //default value

  for(let i=0; i < elementList.length; i++){
      let element = elementList[i];
      itemProperty = element;   //default value

      switch(propertySelect){ //apply correct property name and preferred separation symbol of element
        case "names": 
          itemProperty = element.name; 
          separationsymbol = " / "
          break;
        case "dates": 
          itemProperty = element.value + " tot " + element.end_value; 
          separationsymbol = "<br/> & <br/>";
          break;
      }

      if(i < elementList.length - 1){ //if not last item in list  
        resultingString += itemProperty + separationsymbol; 
      }
      else resultingString += itemProperty;
  }

  return resultingString;
}