/* ============================================
   IB GAMING - LOGIN JAVASCRIPT
============================================ */

document.addEventListener("DOMContentLoaded", function () {

    /* ========================================
       ELEMENT
    ======================================== */

    const loginForm = document.getElementById("loginForm");

    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    const rememberMe = document.getElementById("rememberMe");

    const toggleButtons = document.querySelectorAll(
        ".toggle-password"
    );


    /* ========================================
       REMEMBERED USER
    ======================================== */

    const rememberedUser = localStorage.getItem(
        "ibGamingRememberedUser"
    );

    if (rememberedUser && emailInput) {

        emailInput.value = rememberedUser;

        if (rememberMe) {
            rememberMe.checked = true;
        }

    }


    /* ========================================
       TOGGLE PASSWORD
    ======================================== */

    toggleButtons.forEach(function (button) {

        button.addEventListener("click", function (event) {

            /*
             * Mencegah tombol melakukan submit
             */
            event.preventDefault();

            const targetId =
                button.getAttribute("data-target");

            const targetInput =
                document.getElementById(targetId);

            if (!targetInput) {
                console.error(
                    "Input password tidak ditemukan:",
                    targetId
                );
                return;
            }


            /* ==============================
               SHOW PASSWORD
            ============================== */

            if (targetInput.type === "password") {

                targetInput.type = "text";

                button.setAttribute(
                    "aria-pressed",
                    "true"
                );

                button.setAttribute(
                    "aria-label",
                    "Sembunyikan password"
                );

            }

            /* ==============================
               HIDE PASSWORD
            ============================== */

            else {

                targetInput.type = "password";

                button.setAttribute(
                    "aria-pressed",
                    "false"
                );

                button.setAttribute(
                    "aria-label",
                    "Tampilkan password"
                );

            }

        });

    });


    /* ========================================
       ERROR HANDLING
    ======================================== */

    function removeError(input) {

        if (!input) {
            return;
        }

        input.classList.remove("input-error");

        const formGroup =
            input.closest(".form-group");

        if (!formGroup) {
            return;
        }

        const errorMessage =
            formGroup.querySelector(".error-message");

        if (errorMessage) {
            errorMessage.remove();
        }

    }


    function showError(input, message) {

        if (!input) {
            return;
        }

        removeError(input);

        input.classList.add("input-error");

        const formGroup =
            input.closest(".form-group");

        if (!formGroup) {
            return;
        }

        const errorMessage =
            document.createElement("span");

        errorMessage.className =
            "error-message";

        errorMessage.textContent =
            message;

        formGroup.appendChild(errorMessage);

    }


    /* ========================================
       INPUT EVENTS
    ======================================== */

    /* ==============================
       EMAIL
    ============================== */

    if (emailInput) {

        emailInput.addEventListener(
            "input",
            function () {

                /*
                 * Error email langsung dihapus
                 * ketika user mulai memperbaiki
                 */
                if (emailInput.value.trim() !== "") {
                    removeError(emailInput);
                }

            }
        );

    }


    /* ==============================
       PASSWORD
    ============================== */

    if (passwordInput) {

        passwordInput.addEventListener(
            "input",
            function () {

                const password =
                    passwordInput.value;

                /*
                 * Jika password sudah mencapai
                 * minimal 6 karakter,
                 * hapus pesan error.
                 */
                if (password.length >= 6) {

                    removeError(passwordInput);

                }

            }
        );

    }


    /* ========================================
       LOGIN SUBMIT
    ======================================== */

    if (loginForm) {

        loginForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const email =
                    emailInput
                        ? emailInput.value.trim()
                        : "";

                const password =
                    passwordInput
                        ? passwordInput.value
                        : "";


                let isValid = true;


                /* ==============================
                   EMAIL / USERNAME
                ============================== */

                if (!email) {

                    showError(
                        emailInput,
                        "Email atau username wajib diisi."
                    );

                    isValid = false;

                }


                /* ==============================
                   PASSWORD
                ============================== */

                if (!password) {

                    showError(
                        passwordInput,
                        "Password wajib diisi."
                    );

                    isValid = false;

                }

                else if (password.length < 6) {

                    showError(
                        passwordInput,
                        "Password minimal 6 karakter."
                    );

                    isValid = false;

                }


                /* ==============================
                   STOP LOGIN JIKA VALIDASI GAGAL
                ============================== */

                if (!isValid) {
                    return;
                }


                /* ==================================
                   REMEMBER ME
                ================================== */

                if (
                    rememberMe &&
                    rememberMe.checked
                ) {

                    localStorage.setItem(
                        "ibGamingRememberedUser",
                        email
                    );

                }

                else {

                    localStorage.removeItem(
                        "ibGamingRememberedUser"
                    );

                }


                /* ==================================
                   LOGIN BUTTON
                ================================== */

                const loginButton =
                    loginForm.querySelector(
                        ".login-button"
                    );


                if (loginButton) {

                    loginButton.disabled = true;

                    loginButton.innerHTML = `
                        <span>Memproses...</span>
                    `;

                }


                /* ==================================
                   SIMULASI LOGIN
                ================================== */

                setTimeout(function () {

                    const userData = {

                        username: email,

                        loggedIn: true,

                        loginTime:
                            new Date().toISOString()

                    };


                    localStorage.setItem(
                        "ibGamingUser",
                        JSON.stringify(userData)
                    );


                    /*
                     * Sementara redirect ke halaman utama
                     */
                    window.location.href =
                        "../../pages/user/home.html";

                }, 800);

            }
        );

    }


    /* ========================================
       FORGOT PASSWORD
    ======================================== */

    const forgotPassword =
        document.querySelector(".forgot-password");


    if (forgotPassword) {

        forgotPassword.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                alert(
                    "Fitur reset password akan tersedia pada tahap backend."
                );

            }
        );

    }

});