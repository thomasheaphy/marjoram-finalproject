// CONTACT FORM
(function () {
    console.log("Javascript loaded");
    // const sendMail = (mail) => {
    //     fetch("https://www.thomasheaphy.co.uk/send", {
    //         method: "post",
    //         body: mail,
    //     }).then((res) => {
    //         return res.json();
    //     });
    // };

    // const form = document.getElementById("contact-form");
    // const formEvent = form.addEventListener("submit", (e) => {
    //     e.preventDefault();
    //     let mail = new FormData(form);
    //     sendMail(mail);
    // });

    // DROP DOWN MENU

    let dropdownMenu = document.querySelector(".dropdown-menu");

    dropdownMenu.addEventListener("mouseover", (e) => {
        if (dropdownMenu.classList.contains("closed")) {
            dropdownMenu.classList.remove("closed");
        } else {
            dropdownMenu.classList.add("closed");
        }
    });

    dropdownMenu.addEventListener("mouseout", (e) => {
        if (dropdownMenu.classList.contains("closed")) {
            dropdownMenu.classList.remove("closed");
        } else {
            dropdownMenu.classList.add("closed");
        }
    });

    // LOGIN BOX

    let adminLogin = document.getElementById("admin-login");
    let loginBox = document.getElementById("login-box");
    let mainDoc = document.querySelectorAll("header, main, footer");

    adminLogin.addEventListener("click", (e) => {
        loginBox.classList.add("fadeIn");
        for (let i = 0; i < mainDoc.length; i++) {
            mainDoc[i].classList.add("dimScreen");
        }
        loginBox.style.visibility = "visible";
    });

    mainDoc.forEach((item) => {
        item.addEventListener("click", (e) => {
            loginBox.style.visibility = "hidden";
            loginBox.classList.remove("fadeIn");
            for (let i = 0; i < mainDoc.length; i++) {
                mainDoc[i].classList.remove("dimScreen");
            }
        });
    });
})();
