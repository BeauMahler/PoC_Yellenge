async function getAPIData() {
  try {
    const response = await fetch("https://proxy.corsfix.com/?https://www.rvo.nl/api/v1/opendata/events");
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.json();
    console.log(result[0]);

    //fill table with resulting data
    var idCounter = 1;
    const resultTable = document.getElementById("resultTable");
    result.forEach(item => {
      var landen = "";  //reset string
      var beginDates = "";
      var endDates = "";
      var numberOfCountries = item.countries.length - 1; //-1 because index starts at 0
      var numberOfDates = item.dates.length -1;
      
      //if more than one country, add together in 1 string
      item.countries.forEach(country =>{
        if(item.countries.indexOf(country) == numberOfCountries){ //if last country in list
          landen += country.name; //no final slash
        }
        else landen += country.name + " / ";
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
      
      //fill table rows with data
      resultTable.innerHTML += "<tr><td>" + idCounter + "</td><td>" + item.title + "</td><td>" + landen + "</td><td>" + beginDates + "</td><td>" + endDates + "</td></tr>"

      idCounter++; //up counter
    });
  } catch (error) {
    console.error(error.message);
  }
}