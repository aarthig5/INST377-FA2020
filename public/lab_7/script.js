function convertRestaurantsToCategories(restaurantList) {
  // process your restaurants here!
  const catList = [];
  const catObj = {};
  var i;
  for (let i=0; i<restaurantList.length; i++) {
    catList.push(restaurantList[i].category);
    if (!catObj[catList[i]]) {
      catObj[catList[i]] = 0;
    }
    catObj[catList[i]] += 1;
    // console.log(restaurantList[i].category);
  }
  //   console.log(catObj);
  const list = Object.keys(catObj).map((m) => ({
    y: catObj[m],
    label: m
  }));

  return list;
}

function makeYourOptionsObject(datapointsFromRestaurantsList) {
  // set your chart configuration here!
  CanvasJS.addColorSet('customColorSet1', [
	// add an array of colors here https://canvasjs.com/docs/charts/chart-options/colorset/
	'#1b2d40',
	'#577596',
	'#c7262b',
	'#f85c37',
	'#ff8250',
  ]);

  return {
    animationEnabled: true,
    colorSet: 'customColorSet1',
    title: {
      text: 'Places To Eat Out In Future'
    },
    axisX: {
      interval: 1,
      labelFontSize: 12
    },
    axisY2: {
      interlacedColor: 'rgba(1,77,101,.2)',
      gridColor: 'rgba(1,77,101,.1)',
      title: 'Restaurants By Category',
      labelFontSize: 12,
      scaleBreaks: {customBreaks: [
        {startValue: 40, endValue: 50, color: '#1b2d40'}, 
        {startValue: 85, endValue: 100, color: '#1b2d40'}, 
        {startValue: 140, endValue: 175, color: '#1b2d40'} 
      ]} // Add your scale breaks here https://canvasjs.com/docs/charts/chart-options/axisy/scale-breaks/custom-breaks/
    },
    data: [{
      type: 'bar',
      name: 'restaurants',
      axisYType: 'secondary',
      dataPoints: datapointsFromRestaurantsList
    }]
  };
}

function runThisWithResultsFromServer(jsonFromServer) {
  console.log('jsonFromServer', jsonFromServer);
  sessionStorage.setItem('restaurantList', JSON.stringify(jsonFromServer)); // don't mess with this, we need it to provide unit testing support
  // Process your restaurants list
  // Make a configuration object for your chart
  // Instantiate your chart
  const reorganizedData = convertRestaurantsToCategories(jsonFromServer);
  const options = makeYourOptionsObject(reorganizedData);
  // console.log(reorganizedData);
  const chart = new CanvasJS.Chart('chartContainer', options);
  chart.render();
}

// Leave lines 52-67 alone; do your work in the functions above
document.body.addEventListener('submit', async (e) => {
  e.preventDefault(); // this stops whatever the browser wanted to do itself.
  const form = $(e.target).serializeArray();
  fetch('/api', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(form)
  })
    .then((fromServer) => fromServer.json())
	.then((jsonFromServer) => runThisWithResultsFromServer(jsonFromServer)) 

    .catch((err) => {
      console.log(err);
    });
});