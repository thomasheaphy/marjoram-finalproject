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
        console.log("click on menu");
        if (dropdownMenu.classList.contains("closed")) {
            console.log("remove closed");
            dropdownMenu.classList.remove("closed");
        } else {
            console.log("add closed");
            dropdownMenu.classList.add("closed");
        }
    });

    dropdownMenu.addEventListener("mouseout", (e) => {
        console.log("click on menu");
        if (dropdownMenu.classList.contains("closed")) {
            console.log("remove closed");
            dropdownMenu.classList.remove("closed");
        } else {
            console.log("add closed");
            dropdownMenu.classList.add("closed");
        }
    });

    // LOGIN BOX

    let adminLogin = document.getElementById("admin-login");
    let loginBox = document.getElementById("login-box");
    let mainDoc = document.querySelectorAll("header, main, footer");

    console.log("mainDoc", mainDoc)
   

    adminLogin.addEventListener("click", (e) => {
        console.log("click on login box");
        loginBox.style.visibility = "visible";
        for (let i = 0; i < mainDoc.length; i++) {
            mainDoc[i][0].style.opacity = "0.3";
        }
    });

    mainDoc.addEventListener("click", (e) => {
        console.log("click outside of login box")
        if ()
    } )
})();
