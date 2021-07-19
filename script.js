const apiUnsplashKey = "SwSN79fvrYJbBfTbPhCBrw5nJXkmikgm9ZEQW6g-NdA"
const URL = `https://api.unsplash.com/photos/random/?client_id=${apiUnsplashKey}&orientation=landscape&query=nature`
const weatherAppKey = "070120a021f3bb5996230a77eb454c4a"

const body = document.body
const author = document.getElementById("author")
const crypto = document.getElementById("crypto")
const cryptoTop = document.getElementById("crypto-top")
const timeDisplay = document.querySelector(".time")
const weather = document.getElementById("weather")
const weatherTop = document.getElementById("weather-top")
const quoteText = document.getElementById("quote-text")
const loader = document.getElementById("loader")
const addBtn = document.getElementById("add")
const noteEl = document.querySelector(".note")
const editBtn = document.querySelector(".edit")
const main = document.querySelector(".main")
const textArea = document.querySelector("textarea")

let quotes = []

// Get Random Image Data from API
fetch(URL)
  .then(res => res.json())
  .then(data => {
    // console.log(data.urls.regular)
    body.style.backgroundImage = `url(${data.urls.full})`
    author.textContent = `By: ${data.user.name}`
  })
  .catch(err => {
    //This is where I can handle the error
    //Choose to use a default background image if error occurs
    document.body.style.backgroundImage = `url("https://images.unsplash.com/photo-1560008511-11c63416e52d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyMTEwMjl8MHwxfHJhbmRvbXx8fHx8fHx8fDE2MjI4NDIxMTc&ixlib=rb-1.2.1&q=80&w=1080"
        )`
    document.getElementById("author").textContent = `By: Dodi Achmad`
  })

//   Get Crypto Data from API
fetch("https://api.coingecko.com/api/v3/coins/bitcoin")
  .then(res => {
    if (!res.ok) {
      throw Error("Something went wrong")
    }
    return res.json()
  })
  .then(data => {
    cryptoTop.innerHTML = `<img src=${data.image.small}>
                        <span>${data.name}</span>`
    crypto.innerHTML += `
    <p><i class="fas fa-chart-line"></i> $${data.market_data.current_price.usd}</p>
    <p><i class="fas fa-angle-double-up"></i> $${data.market_data.high_24h.usd}</p>
    <p><i class="fas fa-angle-double-down"></i> $${data.market_data.low_24h.usd}</p>`
  })
  .catch(error => {
    cryptoTop.textContent = "Crypto data is not available at the moment"
    console.error(error)
  })

function showLoadingSpinner() {
  loader.hidden = false
  weather.hidden = true
  weatherTop.hidden = true
}

function removeLoadingSpinner() {
  weather.hidden = false
  weatherTop.hidden = false
  loader.hidden = true
}

//  Get Weather Data from API
navigator.geolocation.getCurrentPosition(position => {
  const lat = position.coords.latitude
  const lon = position.coords.longitude
  showLoadingSpinner()
  fetch(
    `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${weatherAppKey}`
  )
    .then(res => {
      if (!res.ok) {
        throw Error("Weather data not available")
      }
      return res.json()
    })
    .then(data => {
      //   console.log(data)
      //   console.log(data.weather[0].icon)
      const iconURL = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`
      weatherTop.innerHTML = `<img src=${iconURL}>
      <p>${Math.round(data.main.temp)}º</p>`
      weather.innerHTML += `<p>${data.name}</p>`
    })
    .catch(err => console.error(err))
  removeLoadingSpinner()
})

// Get Time
function getCurrentTime() {
  const date = new Date()
  timeDisplay.textContent = date.toLocaleTimeString("en-us", {
    timeStyle: "short",
  })
}

setInterval(getCurrentTime, 1000)

//Get Quotes from API
async function getQuotes() {
  try {
    const url = "https://type.fit/api/quotes"
    const res = await fetch(url)
    const quotes = await res.json()
    const quote = quotes[Math.round(Math.random() * quotes.length)]
    // console.log(quote)

    if (!quote.author) {
      quoteText.innerHTML = `<p>&ldquo;${quote.text}&rdquo;</p>
                            <p>Unknown</p>`
    } else {
      quoteText.innerHTML = `<p>&ldquo;${quote.text}&rdquo;</p>
      <p>${quote.author}</p>`
    }
  } catch (err) {
    console.error(err)
  }
}

//Calling async function
getQuotes()

//Event Handling
addBtn.addEventListener("click", () => {
  addNewNote()
  noteEl.classList.toggle("active")
  if (noteEl.classList.contains("active")) {
    addBtn.innerHTML = `<i class="add-icon fas fa-minus"></i>`
    main.classList.add("hidden")
    textArea.classList.remove("hidden")
  } else {
    addBtn.innerHTML = `<i class="add-icon fas fa-plus"></i>`
    main.classList.remove("hidden")
    textArea.classList.add("hidden")
  }
})

function addNewNote() {
  textArea.addEventListener("input", e => {
    const { value } = e.target
    main.innerHTML = marked(value)
  })
}

//Edit Note
editBtn.addEventListener("click", () => {
  main.classList.toggle("hidden")
  textArea.classList.toggle("hidden")
})
