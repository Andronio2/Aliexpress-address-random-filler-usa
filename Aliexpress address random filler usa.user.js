// ==UserScript==
// @name         Aliexpress address random filler USA
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Заполняет поля случайными адресными данными США на Алиэкспресс
// @author       Andronio
// @homepage     https://github.com/Andronio2/Aliexpress-address-random-filler-usa
// @supportURL   https://github.com/Andronio2/Aliexpress-address-random-filler-usa/issues
// @updateURL    https://github.com/Andronio2/Aliexpress-address-random-filler-usa/raw/master/Aliexpress%20address%20random%20filler%20usa.user.js
// @downloadURL  https://github.com/Andronio2/Aliexpress-address-random-filler-usa/raw/master/Aliexpress%20address%20random%20filler%20usa.user.js
// @match        ilogisticsaddress.aliexpress.com/addressList.htm*
// @match        ilogisticsaddress.aliexpress.ru/addressList.htm*
// @grant        none
// ==/UserScript==
(function () {
    'use strict';
/*
*/

let myIndex     = 99999; // пять цифр
let myPhoneCode = "+1";
let myCountry   = "United States";

let delayStep   = 200; //ms

/*
 * Дальше не трогать
 */
    let div = document.createElement('div');

    div.innerHTML = '<button type="button" id="btn-fill-usa" class="next-btn next-medium next-btn-primary">Fill random USA</button>';

    document.getElementById('address-main').append(div);
    let fillBtn = document.getElementById('btn-fill-usa');
    fillBtn.addEventListener('click', fillAddrFunc);

    let currMode = 0;

    // Функция заполения адреса
    function fillAddrFunc() {
	    if (!document.querySelector('input[name="contactPerson"]')) return;
		let nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;

        switch(currMode) {
            case 0: //Заполняем поля, смотрим страну
                let name = document.querySelector('input[name="contactPerson"]');
				nativeInputValueSetter.call(name, randomString(+getRandomInt(4) + 5) + ' ' + randomString(+getRandomInt(4) + 5));
				name.dispatchEvent(new Event('change', {bubbles: true}));

                let addr = document.querySelector('input[name="address"]');
				nativeInputValueSetter.call(addr, randomString(+getRandomInt(4) + 5) + getRandomInt(999) + ' ' + randomString(+getRandomInt(4) + 5) + getRandomInt(999));
				addr.dispatchEvent(new Event('change', {bubbles: true}));

                let zip = document.querySelector('input[name="zip"]');
				nativeInputValueSetter.call(zip, getRandomInt(myIndex));
				zip.dispatchEvent(new Event('change', {bubbles: true}));

                let phone = document.querySelector('input[name="mobileNo"]');
				nativeInputValueSetter.call(phone, getRandomInt(999) + '-' + getRandomInt(9999999));
				phone.dispatchEvent(new Event('change', {bubbles: true}));

				let currCountry = document.querySelector('.fuck_country .next-select .country-name');
				if (currCountry.innerText != myCountry) {
					currCountry.click();
					currMode = 1;
					return setTimeout(fillAddrFunc, 200);
				} else currMode = 3;
                return setTimeout(fillAddrFunc, 200);
                break;
			case 1: //Ждем списка стран, выбираем страну
				let allCountry = document.querySelectorAll('.fuck_country .next-overlay-wrapper .country-name');
				if (allCountry.length == 0) return setTimeout(fillAddrFunc, 200);
				for (let i = 0; i < allCountry.length; i++) {
					if (allCountry[i].innerText == myCountry) {
						allCountry[i].click();
						currMode = 2;
						return setTimeout(fillAddrFunc, 200);
					}
				}
				currMode = 0;
				alert('Неверная страна');
                break;
			case 2: //Ждем круг ожидания
				let waitCircle = document.querySelectorAll('.next-loading-tip');
				if (waitCircle.length != 0) return setTimeout(fillAddrFunc, 200);
				currMode = 3;
				return setTimeout(fillAddrFunc, delayStep);
				break;
			case 3:
				let currOblast = document.querySelectorAll('.selector-item .next-select em');
                if (currOblast.length == 0) return setTimeout(fillAddrFunc, 200);
				currOblast[0].click();
				currMode = 4;
				return setTimeout(fillAddrFunc, 500);
			case 4: //Ждем список областей, выбираем область
				let allOblast = document.querySelectorAll('.selector-item')[0].querySelectorAll('.next-overlay-wrapper .next-menu-item');
				if (allOblast.length == 0) return setTimeout(fillAddrFunc, 200);
				setTimeout(() => allOblast[getRandomInt(allOblast.length - 1)].click(), 500);
				currMode = 5;
				return setTimeout(fillAddrFunc, delayStep + 500);
			case 5:
				let currGorod = document.querySelectorAll('.selector-item .next-select em')[1];
				currGorod.click();
				currMode = 6;
				return setTimeout(fillAddrFunc, 200);
			case 6: //Ждем список городов, выбираем город
				let allGorod = document.querySelectorAll('.selector-item')[1].querySelectorAll('.next-overlay-wrapper .next-menu-item');
				if (allGorod.length == 0) return setTimeout(fillAddrFunc, 200);
				setTimeout(() => allGorod[getRandomInt(allGorod.length - 1)].click(), 1000);
				currMode = 7;
				return setTimeout(fillAddrFunc, delayStep + 1000);
			case 7:
				let phoneCode = document.getElementById('phoneCountry');
				nativeInputValueSetter.call(phoneCode, myPhoneCode);
				phoneCode.dispatchEvent(new Event('change', {bubbles: true}));

                document.querySelectorAll('.address-save button')[0].click();
				currMode = 8;
				return setTimeout(fillAddrFunc, 200);
				break;
			case 8: //Ждем круг ожидания
				let waitCircle2 = document.querySelectorAll('.next-loading-tip');
				if (waitCircle2.length != 0) return setTimeout(fillAddrFunc, 200);
				currMode = 9;
				return setTimeout(fillAddrFunc, delayStep);
				break;
            case 9:
				document.querySelectorAll('.address-save button')[0].click();
                break;
            default:
                alert("Ошибка в программе");
        }
    }

	function randomString(i)
	{
	    var text = "";
	    var possible = "abcdefghijklmnopqrstuvwxyz";

	    while (text.length < i)
	        text += possible.charAt(Math.floor(Math.random() * possible.length));

	    return text;
	}

	function getRandomInt(max) {
	  return Math.floor(Math.random() * Math.floor(max)).toString();
	}
})();
