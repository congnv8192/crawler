const puppeteer = require("puppeteer");

(async () => {
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    await page.goto("https://www.vntrip.vn/hotel/vn/hoang-sa-hotel-458?checkInDate=20210117&nights=1");

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

    console.log(rooms);

    await browser.close();
})();