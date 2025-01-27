# Getting Started with SIPRI Arms Trade Website

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:
### `npm i`

Install the needed modules to run the website.

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.


## About
* What is SIPRI?
  * SIPRI is an independent international institute dedicated to research into conflict, armaments, arms control and disarmament. Established in 1966, SIPRI provides data, analysis and recommendations, based on open sources, to policymakers, researchers, media and the interested public. Based in Stockholm, SIPRI is regularly ranked among the most respected think tanks worldwide.
* What was the inspiration for the project?
  * The SIPRI Arms Trade Website idea was inspired after trying to check certain data in the [SIPRI Arms Trade Registers](https://armstransfers.sipri.org/ArmsTransfer/TransferRegister) website. There is an option to download data as csv, which is not very useful without parsing it, and also an option to view on screen. However, this option is unsorted and not very useful to check certain armament categories or sort by order year.
  * Here is a view of that screen:
<img src='./Gifs and photos/SIPRI Website Screenshot.png' title='Video Walkthrough' width='' alt='Video Walkthrough' />

* Website overview:
  * Interactive map - Click a country to see the data. No need to add countries by typing their names
  * Broad overview - Buttons display the number of weapons for that category
  * Armament category - Click each button to see the specific data for that category
  * Sorted table - The table is sorted by order year and then armament category
<img src='./Gifs and photos/SIPRI.gif' title='Video Walkthrough' width='' alt='Video Walkthrough' />

* The data is updated until September 2024.
* The frontend is built with React and React Router.
* The backend is built with Postgres, Express, Sequelize, and NodeJS.

