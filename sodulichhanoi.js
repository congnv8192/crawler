const puppeteer = require("puppeteer");
const fs = require('fs');

const HOME_URL = "https://sodulich.hanoi.gov.vn/";

let browser;

async function main() {
  browser = await puppeteer.launch({headless: true}); 

  // get locations
  const locations = await getLocations();
  console.log(locations[5]);

  let data = JSON.stringify(locations);
  fs.writeFileSync('vntrip_locations.json', data);
  
  // get hotels by locations
  const hanoi = locations[5];
  const hotels = await getHotels(hanoi);
  console.log(hotels)

  let data_1 = JSON.stringify(hotels);
  fs.writeFileSync('vntrip_hotel1.json', data_1);
  
  // get hotel info
  // for (hotel of hotels) {
  // const hotels_info = await getHotelsInfo(hotel);
  // console.log(hotels_info)
  // let data_2 = JSON.stringify(hotels_info);
  // fs.writeFileSync('vntrip_hotel1.json', data_2);
  //}
  //const hanoihotelinfo = hotels[0];
  //const hotels_info = await getHotelsInfo(hanoihotelinfo);
  // console.log(hotels_info)
await browser.close();
}

main();

async function getLocations() {
  const page = await browser.newPage();
  await page.goto(HOME_URL);

  return await page.evaluate(async () => {
    const $locations = document.querySelectorAll("ul.topnav li a");
    const locations = [];

    for ($location of $locations) {
      locations.push($location.href);
    }
    
    return locations;
  });
}

async function getHotels(url) {
  const page = await browser.newPage();
  await page.goto(url);

  return await page.evaluate(async () => {
    const $hotels = document.querySelectorAll(".news-list-item > a");
    const hotels = [];

    for ($hotel of $hotels) {
      hotels.push($hotel.href);
    }
    hotels.push(document.textContent);
    return hotels;
  });
}

async function getHotelsInfo(url) {
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0);
    await page.goto(url);

    const rooms = await page.evaluate(async () => {
        const $rooms = document.querySelectorAll(".roomItem__name button");
        const rooms = [];

        for ($room of $rooms) {
            const room = {};
            room.name = $room.innerText;

            // get room info
            await $room.click();
            const $info = document.querySelector(".roomDetail__text");
            room.info = $info.innerText;
            
            rooms.push(room);
        }

        return rooms;
    });

    return rooms
}