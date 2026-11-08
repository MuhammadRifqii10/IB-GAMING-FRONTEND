/* ============================================
   IB GAMING - INDEX JAVASCRIPT
============================================ */

document.addEventListener("DOMContentLoaded", function () {


    /* ========================================
       CEK LOGIN
    ======================================== */

    function isLoggedIn() {

        const userData =
            localStorage.getItem("ibGamingUser");

        return userData !== null;

    }


    /* ========================================
       BOOKING PLAYSTATION
       WAJIB LOGIN
    ======================================== */

    const bookingLinks =
        document.querySelectorAll(
            'a[href="pages/user/booking-form.html"]'
        );


    bookingLinks.forEach(function (bookingLink) {

        bookingLink.addEventListener(
            "click",
            function (event) {

                event.preventDefault();


                if (isLoggedIn()) {

                    // Sudah login
                    window.location.href =
                        "pages/user/booking-form.html";

                } else {

                    // Belum login
                    window.location.href =
                        "pages/auth/login.html";

                }

            }
        );

    });


    /* ========================================
       PESAN F&B
       TIDAK WAJIB LOGIN
    ======================================== */

    const fnbLinks =
        document.querySelectorAll(
            'a[href="pages/user/fnb-form.html"]'
        );


    fnbLinks.forEach(function (fnbLink) {

        fnbLink.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                // Login atau tidak tetap bisa masuk F&B
                window.location.href =
                    "pages/user/fnb-form.html";

            }
        );

    });


});