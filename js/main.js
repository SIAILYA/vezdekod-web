var formSubmitCount = 0

function submitForm() {
    let name = $("#name-inp")
    let surname = $("#surname-inp")
    let email = $("#email-inp")
    let company = $("#company-inp")
    let city = $("#city-inp")
    let message = $("#message-inp")

    let isEmailValid = emailValidation(email.val().toLowerCase())
    let isNameValid = fieldValidation(name.val())
    let isSurnameValid = fieldValidation(surname.val())
    let isCompanyValid = fieldValidation(company.val())
    let isCityValid = fieldValidation(city.val())
    let isMessageValid = fieldValidation(message.val())

    let fields = [[isEmailValid, email, null], [isNameValid, name, null], [isSurnameValid, surname, null],
        [isCompanyValid, company, null], [isCityValid, city, null], [isMessageValid, message, null]]

    for (let i = 0; i < 6; i++) {
        let field = fields[i]

        if (!field[0]) {
            field[1][0].classList.remove("valid")
            field[1][0].classList.add("invalid")
            fields[i][2] = false
        } else {
            field[1][0].classList.remove("invalid")
            field[1][0].classList.add("valid")
            fields[i][2] = true
        }
    }

    if (fields.every((val) => {
        return val[2] === true
    })) {
        // if (confirm("Форма заполнена верно! Скачать результаты в txt-файл?")) {
        //     downloadResults(name.val(), surname.val(), email.val(), company.val(), city.val(), message.val())
        // }
        formSubmitCount += 1
        if (formSubmitCount % 2 === 0) {
            addMessage("Упс...", "Форма отправлена " + formSubmitCount + " раз(а)!", false, true)
        } else {
            addMessage("Все окей!", "Данные успешно отправлены!", true, true)
        }
    } else {
        addMessage("Что-то пошло не так", "В веденных данных найдена ошибка!", false, false)
    }
}

function downloadResults() {
    let name = $("#name-inp").val()
    let surname = $("#surname-inp").val()
    let email = $("#email-inp").val()
    let company = $("#company-inp").val()
    let city = $("#city-inp").val()
    let message = $("#message-inp").val()

    let text = `Name: ${name}\nSurname: ${surname}\nEmail: ${email}\nCompany: ${company}\nCity: ${city}\nMessage: ${message}`;
    let csvData = 'data:application/txt;charset=utf-8,' + encodeURIComponent(text);

    $('<a href="' + csvData + '" download="results.txt" target="_blank" id="download-txt"></a>').appendTo("#submit-box")
    $("#download-txt")[0].click()
    $("#download-txt").remove()
}

function emailValidation(emailStr) {
    if (emailStr.indexOf("@") !== -1) {
        let mailDomain = emailStr.split("@")

        //    mail check:
        let checkFirstLatin = "abcdefghijklmnopqrstuvwxyz".indexOf(mailDomain[0][0]) !== -1
        let checkAlpha = Array.from(mailDomain[0]).every((value) => {
            return "abcdefghijklmnopqrstuvwxyz1234567890-_".indexOf(value) !== -1
        })

        //    domain check
        let checkDots = (mailDomain[1].match(/\./g) || []).length
        if (checkDots >= 1) {
            var checkDomainPost = 2 <= mailDomain[1].split(".")[1].length <= 3
        }
        let checkDomainAlpha = Array.from(mailDomain[1].split(".")[0]).every((value) => {
            return "abcdefghijklmnopqrstuvwxyz1234567890-_".indexOf(value) !== -1
        })

        return checkFirstLatin && checkAlpha && checkDots >= 1 && checkDomainPost && checkDomainAlpha
    }
    return false
}

function fieldValidation(fieldStr) {
    if (fieldStr.length >= 5) {
        let checkThreeAlpha = fieldStr.search(/([А-НП-Яа-нп-яA-z])\1\1+/g)
        let checkTwoNonDigits = fieldStr.search(/[.,/!_\\-]{2,}/gmiu)

        return (checkThreeAlpha === -1) && (checkTwoNonDigits === -1)
    }
    return false
}

function switchLanguage(lngCode) {
    if (lngCode === "ar") {
        $("head").append('<link href="css/rtl.css" rel="stylesheet">')
    } else {
        let styleSheets = document.styleSheets;
        let href = 'css/rtl.css';
        for (let i = 0; i < styleSheets.length; i++) {
            if (styleSheets[i].href && styleSheets[i].href.indexOf(href) !== -1) {
                styleSheets[i].disabled = true;
            }
        }
    }

    $("#lng-ru")[0].classList.remove("active")
    $("#lng-en")[0].classList.remove("active")
    $("#lng-ar")[0].classList.remove("active")
    $("#lng-" + lngCode)[0].classList.add("active")

    let translate = translations[lngCode]
    const translationFields = ["tr-header", "tr-name", "tr-surname", "tr-email", "tr-company",
        "tr-city", "tr-msg", "tr-submit"]

    for (let i = 0; i < translationFields.length - 1; i++) {
        $("#" + translationFields[i]).text((translate[translationFields[i]]))
    }
}

var messageID = 0

function addMessage(header, text, positive, download) {

    messageID += 1
    let currentMsgID = messageID

    $("#form-feedback").append(`
<div class="w-50 feedback-message ${!positive ? 'feedback-negative' : ''}" id="msg-${messageID}">
    <h3>${header}</h3>
    <span>${text}</span>
    ${download ? '<a onclick="downloadResults()" class="download-link">Скачать результаты txt-файлом</a>' : ""}
</div>`)

    setTimeout(() => {
        removeMessage(currentMsgID)
    }, 5000)
}

function removeMessage(msgID) {
    $("#msg-" + msgID)[0].style.height = 0
    $("#msg-" + msgID)[0].style.padding = 0
    setTimeout(() => {
        $("#msg-" + msgID).remove()
    }, 400)
}