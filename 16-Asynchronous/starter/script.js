'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

///////////////////////////////////////

// https://countries-api-836d.onrender.com/countries/

const renderCountry = function(data, className = "") {
    const html = `
        <article class="country ${className}">
            <img class="country__img" src="${data.flag}" />
            <div class="country__data">
            <h3 class="country__name">${data.name}</h3>
            <h4 class="country__region">${data.region}</h4>
            <p class="country__row"><span>👫</span>${(data.population / 1000000).toFixed(1)}</p>
            <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
            <p class="country__row"><span>💰</span>${data.currencies[0].name}</p>
            </div>
        </article>
    `;
    countriesContainer.insertAdjacentHTML("beforeend", html);
}

const renderError = function(message) {
    countriesContainer.insertAdjacentHTML("beforeend", message);
}

// const getJSON = function (url, errorMessage = "Something goes wrong!") {
//     return fetch(url)
//         .then((response) => {
//             if (!response.ok) {
//                 throw new Error(`${errorMessage} (${response.status})`);
//             }

//             return response.json();
//         })
// }

// const getCountryAndNeighbour = function(country) {
//     getJSON(`https://countries-api-836d.onrender.com/countries/name/${country}`, "Country not found!")
//         .then((data) => {
//             renderCountry(data[0]);
//             const neighbour = data[0].borders[0];

//             if (!neighbour) throw new Error("No neighbour found!");

//             return getJSON(`https://countries-api-836d.onrender.com/countries/alpha/${neighbour}`, "Country not found!");
//         })
//         .then((data) => renderCountry(data, "neighbour"))
//         .catch((error) => renderError(`Something went wrong! ${error.message}. Try again!`))
//         .finally(() => countriesContainer.style.opacity = 1);
// }

const getPosition = function () {
    return new Promise(function (resolve, reject) {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
};

const authCode = "237430007007902358062x39616";

const whereAmI = async function() {
    try {
        const position = await getPosition();
        const { latitude: lat, longitude: lng } = position.coords;

        const resGeo = await fetch(`https://geocode.xyz/${lat},${lng}?geoit=json&auth=${authCode}`);
        const dataGeo = await resGeo.json();

        if (!resGeo.ok) throw new Error("Problem getting location data");

        const res = await fetch(`https://countries-api-836d.onrender.com/countries/name/${dataGeo.country}`);
        const data = await res.json();

        if (!res.ok) throw new Error("Problem getting country");

        renderCountry(data[0]);

        return `You're in ${dataGeo.city}, ${dataGeo.country}!`;
    } catch(err) {
        console.error(err);
        renderError(`Something went wrong! ${err.message}. Try again!`);
    } finally {
        countriesContainer.style.opacity = 1;
    }
};

btn.addEventListener("click", function() {
    whereAmI();
    // getCountryAndNeighbour("poland");
});

// (async function() {
//     try {
//         const city = await whereAmI();
//         console.log(city);
//     } catch(error) {
//         console.error(error);
//     } finally {
//         console.log("Finished")
//     }
// })();

// const getThreeCountries = async function(country1, country2, country3) {
//     try {
//         const data = await Promise.all([getJSON(`https://countries-api-836d.onrender.com/countries/name/${country1}`),
//         getJSON(`https://countries-api-836d.onrender.com/countries/name/${country2}`),
//         getJSON(`https://countries-api-836d.onrender.com/countries/name/${country3}`)]);
//         console.log(data)
//     } catch(err) {
//         console.error(err);
//     } finally {

//     }
// }
// getThreeCountries("poland", "belarus", "australia");

// Coding Challenge #1

/* 
In this challenge you will build a function 'whereAmI' which renders a country ONLY based on GPS coordinates. 
For that, you will use a second API to geocode coordinates.

Here are your tasks:

PART 1
1. Create a function 'whereAmI' which takes as inputs a latitude value (lat) and a longitude value (lng) 
(these are GPS coordinates, examples are below).
2. Do 'reverse geocoding' of the provided coordinates. 
Reverse geocoding means to convert coordinates to a meaningful location, like a city and country name. 
Use this API to do reverse geocoding: https://geocode.xyz/api.
The AJAX call will be done to a URL with this format: https://geocode.xyz/52.508,13.381?geoit=json. 
Use the fetch API and promises to get the data. Do NOT use the getJSON function we created, that is cheating 😉
3. Once you have the data, take a look at it in the console to see all the attributes 
that you recieved about the provided location. Then, using this data, log a messsage like this to the console: 
'You are in Berlin, Germany'
4. Chain a .catch method to the end of the promise chain and log errors to the console
5. This API allows you to make only 3 requests per second. If you reload fast, 
you will get this error with code 403. This is an error with the request. 
Remember, fetch() does NOT reject the promise in this case. So create an error to reject the promise yourself, 
with a meaningful error message.

PART 2
6. Now it's time to use the received data to render a country. 
So take the relevant attribute from the geocoding API result, 
and plug it into the countries API that we have been using.
7. Render the country and catch any errors, just like we have done in the last lecture 
(you can even copy this code, no need to type the same code)

TEST COORDINATES 1: 52.508, 13.381 (Latitude, Longitude)
TEST COORDINATES 2: 19.037, 72.873
TEST COORDINATES 2: -33.933, 18.474
*/

// const authCode = "237430007007902358062x39616";

// const whereAmI = function (lat, lng) {
//     fetch(`https://geocode.xyz/${lat},${lng}?geoit=json&auth=${authCode}`)
//         .then((response) => {
//             if (!response.ok) {
//                 throw new Error("You reload too fast, wait 3s, please");
//             }

//             return response.json();
//         })
//         .then((data) => {
//             console.log(`You are in ${data.city}, ${data.country}`);
//             fetch(`https://countries-api-836d.onrender.com/countries/name/${data.country}`)
//                 .then((response) => {
//                     if (!response.ok) {
//                         throw new Error(`${errorMessage} (${response.status})`);
//                     }

//                     return response.json();
//                 })
//                 .then((data) => {
//                     renderCountries(data[0]);
//                 })
//                 .catch((error) => renderError(`Something went wrong! ${error.message}. Try again!`))
//                 .finally(() => countriesContainer.style.opacity = 1);
//         })
//         .catch((err) => console.log(err.message))
// }

// const test1 = whereAmI(52.508, 13.381);
// const test2 = whereAmI(19.037, 72.873);
// const test3 = whereAmI(-33.933, 18.474);

// Coding Challenge #2

/* 
Build the image loading functionality that I just showed you on the screen.

Tasks are not super-descriptive this time, so that you can figure out some stuff on your own. 
Pretend you're working on your own 😉

PART 1
1. Create a function 'createImage' which receives imgPath as an input. 
This function returns a promise which creates a new image (use document.createElement('img')) 
and sets the .src attribute to the provided image path. When the image is done loading, 
append it to the DOM element with the 'images' class, and resolve the promise. 
The fulfilled value should be the image element itself. 
In case there is an error loading the image ('error' event), reject the promise.

If this part is too tricky for you, just watch the first part of the solution.

PART 2
2. Comsume the promise using .then and also add an error handler;
3. After the image has loaded, pause execution for 2 seconds using the wait function we created earlier;
4. After the 2 seconds have passed, hide the current image (set display to 'none'), 
and load a second image (HINT: Use the image element returned by the createImage promise to hide the current image. 
You will need a global variable for that 😉);
5. After the second image has loaded, pause execution for 2 seconds again;
6. After the 2 seconds have passed, hide the current image.

TEST DATA: Images in the img folder. Test the error handler by passing a wrong image path. 
Set the network speed to 'Fast 3G' in the dev tools Network tab, otherwise images load too fast.
*/

// const imagesContainer = document.querySelector(".images");
// let currentImage;

// const wait = function (seconds) {
//     return new Promise(function (resolve) {
//       setTimeout(resolve, seconds * 1000);
//     });
// };

// const createImages = function(imgPath) {
//     return new Promise(function(resolve, reject) {
//         const image = document.createElement("img");
//         image.setAttribute("src", imgPath);

//         image.addEventListener("load", function() {
//             imagesContainer.append(image);
//             resolve(image);
//         });

//         image.addEventListener("error", function() {
//             reject(new Error("Image not found!"));
//         })
//     });
// }
// createImages("./img/img-1.jpg")
//     .then((image) => {
//         currentImage = image;
//         return wait(2);
//     })
//     .then(() => {
//         currentImage.style.display = "none";
//         return createImages("./img/img-2.jpg");
//     })
//     .then((image) => {
//         currentImage = image;
//         return wait(2);
//     })
//     .then(() => {
//         currentImage.style.display = "none";
//         return createImages("./img/img-3.jpg");
//     })
//     .catch((error) => {
//         console.error(error.message);
//     });

// Coding Challenge #3

/* 
PART 1
Write an async function 'loadNPause' that recreates Coding Challenge #2, this time using async/await 
(only the part where the promise is consumed). Compare the two versions, think about the big differences, 
and see which one you like more.
Don't forget to test the error handler, and to set the network speed to 'Fast 3G' in the dev tools Network tab.

PART 2
1. Create an async function 'loadAll' that receives an array of image paths 'imgArr';
2. Use .map to loop over the array, to load all the images with the 'createImage' function 
(call the resulting array 'imgs')
3. Check out the 'imgs' array in the console! Is it like you expected?
4. Use a promise combinator function to actually get the images from the array 😉
5. Add the 'paralell' class to all the images (it has some CSS styles).

TEST DATA: ['img/img-1.jpg', 'img/img-2.jpg', 'img/img-3.jpg']. To test, turn off the 'loadNPause' function.
*/

// const loadNPause = async function(imgPath) {
//     try {
//         let image = await createImages(imgPath);
//         await wait(2);
//         image.style.display = "none";

//         image = await createImages("./img/img-2.jpg");
//         await wait(2);
//         image.style.display = "none";

//         return await createImages("./img/img-3.jpg");
//     } catch(err) {
//         console.error(err);
//     }
// }
// loadNPause('img/img-1.jpg');

// const testData = ['img/img-1.jpg', 'img/img-2.jpg', 'img/img-3.jpg'];

// const loadAll = async function(imgArr) {
//     const imgs = imgArr.map(async(img) => await createImages(img));
//     const data = await Promise.all(imgs);
//     data.forEach((img) => img.classList.add("parallel"));
// }
// loadAll(testData);