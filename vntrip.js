const puppeteer = require("puppeteer");

const HOME_URL = "https://www.vntrip.vn/khach-san";

let browser;

async function main() {
  browser = await puppeteer.launch({headless: true});

  // get locations
  const locations = await getLocations();
  console.log(locations);
  
  // get hotels by locations
  // get hotel info
  
  await browser.close();
}

main();

async function getLocations() {
  const page = await browser.newPage();
  await page.goto(HOME_URL);

  return await page.evaluate(async () => {
    const $locations = document.querySelectorAll("ul.footer__list li a");
    const locations = [];

    for ($location of $locations) {
      locations.push($location.href);
    }
    
    return locations;
  });
}
