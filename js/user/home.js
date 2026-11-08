/* ============================================
   IB GAMING - HOME JAVASCRIPT
============================================ */

document.addEventListener("DOMContentLoaded", function () {


    /* ========================================
       PROFILE DROPDOWN
    ======================================== */

    const profileButton =
        document.getElementById("profileButton");

    const profileDropdown =
        document.getElementById("profileDropdown");


    if (profileButton && profileDropdown) {


        /* ==============================
           BUKA / TUTUP DROPDOWN
        ============================== */

        profileButton.addEventListener(
            "click",
            function (event) {

                event.stopPropagation();


                const isOpen =
                    profileDropdown.classList.contains("show");


                if (isOpen) {

                    profileDropdown.classList.remove("show");

                    profileButton.classList.remove("active");

                    profileButton.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                } else {

                    profileDropdown.classList.add("show");

                    profileButton.classList.add("active");

                    profileButton.setAttribute(
                        "aria-expanded",
                        "true"
                    );

                }

            }
        );


        /* ==============================
           KLIK DI LUAR DROPDOWN
        ============================== */

        document.addEventListener(
            "click",
            function (event) {

                if (
                    !profileButton.contains(event.target) &&
                    !profileDropdown.contains(event.target)
                ) {

                    profileDropdown.classList.remove(
                        "show"
                    );

                    profileButton.classList.remove(
                        "active"
                    );

                    profileButton.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                }

            }
        );

    }


    /* ========================================
       LOGOUT
    ======================================== */

    const logoutButton =
        document.getElementById("logoutButton");


    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            function () {


                /*
                 * Hapus data login
                 */

                localStorage.removeItem(
                    "ibGamingUser"
                );


                localStorage.removeItem(
                    "ibGamingRememberedUser"
                );


                /*
                 * Kembali ke halaman login
                 *
                 * Path sesuaikan dengan posisi
                 * home.html kamu.
                 */

                window.location.href =
                    "../index.html";

            }
        );

    }

});