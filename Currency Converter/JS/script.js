const dropDown = document.querySelectorAll(".dropdown select"),
formCurrency = document.querySelector(".from select"),
toCurrency = document.querySelector(".to select"),
getBtn = document.querySelector("form button"),
amount = document.querySelector(".amount input"),
exchangeRateText = document.querySelector(".message"),
exchangeIcon = document.querySelector(".dropdown .icon"),
apiKey = "9d159b9459bccb2aae9e45e0";


for(let i = 0; i < dropDown.length; i++){
    for(currency_code in countryList){
        let selected;
        if(i == 0){
            selected = currency_code == "USD" ? "selected" : "";
        }else if(i == 1){
            selected = currency_code == "INR" ? "selected" : "";
        }
        let optionTag = `<option value="${currency_code}" ${selected}>${currency_code}</option>`;
        dropDown[i].insertAdjacentHTML("beforeend", optionTag);
    }

    dropDown[i].addEventListener("change", e =>{
        loadFlag(e.target);
    })
}

function loadFlag(element){
    for(code in countryList){
        if(code == element.value){
            let imgTag = element.parentElement.querySelector("img");
            imgTag.src = `https://flagsapi.com/${countryList[code]}/flat/64.png`; 
        }
    }
}

window.addEventListener("load", () =>{
    getExchangeRate();
});

getBtn.addEventListener("click", e =>{
    e.preventDefault();
    getExchangeRate();
});


let rotationAngle = 0;

exchangeIcon.addEventListener("click", () => {
    let tempCode = formCurrency.value;
    formCurrency.value = toCurrency.value;
    toCurrency.value = tempCode;
    loadFlag(formCurrency);
    loadFlag(toCurrency);
    getExchangeRate();

    rotationAngle = (rotationAngle === 0) ? 180 : 0;

    exchangeIcon.style.transform = `rotate(${rotationAngle}deg)`;
    exchangeIcon.style.transition = "transform 0.5s ease";    
})

function getExchangeRate(){


    let amountVal = amount.value;

    if(amountVal == "" || amountVal == "0"){
        amount.value = "1";
        amountVal = 1;
    } 

    exchangeRateText.innerHTML = '<i class="fa-solid fa-arrows-rotate rotation"></i>';
    

    //Fetch API and convert into JSON format

    let url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${formCurrency.value}`;

    fetch(url).then(response => response.json()).then(result => {

        let exchangeRate = result.conversion_rates[toCurrency.value];
        let totalExchangeRate = (amountVal * exchangeRate).toFixed(2);
        exchangeRateText.innerHTML = `${amountVal} ${formCurrency.value} = ${totalExchangeRate} ${toCurrency.value}`;
        
    })

    .catch(error => {
        exchangeRateText.innerHTML = "Failed to get exchange rate..";
        console.error('Error fetching exchange rate:',error);
    })
}
