// You may wish to find an effective randomizer function on MDN.

function range(int) {
  const arr = [];
  for (let i = 0; i < int; i += 1) {
    arr.push(i);
  }
  return arr;
}

function sortFunction(a, b, key) {
  if (a[key] < b[key]) {
    return -1;
  } if (a[key] > b[key]) {
    return 1;
  }
  return 0;
}

// function getRandomInt(min,max) {
//   return Math.floor(Math.random() * Math.floor(max));
// }

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive 
}

document.body.addEventListener('submit', async (e) => {
  e.preventDefault(); // this stops whatever the browser wanted to do itself.
  const form = $(e.target).serializeArray(); // here we're using jQuery to serialize the form
  fetch('/api', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(form)
  })
    .then((fromServer) => fromServer.json())
    .then((fromServer) => {
      // You're going to do your lab work in here. Replace this comment.
      // console.log('fromServer', fromServer);
      console.log(fromServer)
      if (document.querySelector('.flex-inner')) {
        document.querySelector('.flex-inner').remove();
      }

      const randomTen = range(10);
      const tenMap = randomTen.map(() => {
        const number = getRandomIntInclusive(0,243);
        return fromServer[number];
      });

      const reverseList = tenMap.sort((a, b) => sortFunction(b, a, 'name'));
      const orderedList = document.createElement('ol');
      orderedList.className = 'flex-inner';
      $('form').prepend(orderedList);

      reverseList.forEach((element, i) => {
        const unorderedList = document.createElement('li');
        $(unorderedList).append(`<input type="checkbox" value=${element.code} id=${element.code} />`);
        $(unorderedList).append(`<label for=${element.code}>${element.name}</label>`);
        $(orderedList).append(unorderedList);
      });
    })

    .catch((err) => console.log(err));
});