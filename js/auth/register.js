/* ============================================
   IB GAMING - REGISTER JAVASCRIPT
============================================ */

document.addEventListener("DOMContentLoaded", function () {

    /* ========================================
       ELEMENT
    ======================================== */

    const registerForm =
        document.getElementById("registerForm");

    const fullnameInput =
        document.getElementById("fullname");

    const usernameInput =
        document.getElementById("username");

    const emailInput =
        document.getElementById("email");

    const phoneInput =
        document.getElementById("phone");

    const passwordInput =
        document.getElementById("password");

    const confirmPasswordInput =
        document.getElementById("confirmPassword");

    const toggleButtons =
        document.querySelectorAll(".toggle-password");

    const successModal =
        document.getElementById("successModal");

    const successLoginButton =
        document.getElementById("successLoginButton");


    /* ========================================
       TOGGLE PASSWORD
    ======================================== */

    toggleButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const targetId =
                button.getAttribute("data-target");

            const targetInput =
                document.getElementById(targetId);

            if (!targetInput) {
                return;
            }


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

            } else {

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
       REMOVE ERROR WHEN USER TYPES
    ======================================== */

    const inputs = [
        fullnameInput,
        usernameInput,
        emailInput,
        phoneInput,
        passwordInput,
        confirmPasswordInput
    ];


    inputs.forEach(function (input) {

        if (!input) {
            return;
        }

        input.addEventListener(
            "input",
            function () {

                removeError(input);

            }
        );

    });


    /* ========================================
       PHONE NUMBER
    ======================================== */

    if (phoneInput) {

        phoneInput.addEventListener(
            "input",
            function () {

                this.value =
                    this.value.replace(
                        /[^0-9+]/g,
                        ""
                    );

            }
        );

    }


    /* ========================================
       VALIDATE FORM
    ======================================== */

    if (registerForm) {

        registerForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const fullname =
                    fullnameInput.value.trim();

                const username =
                    usernameInput.value.trim();

                const email =
                    emailInput.value.trim();

                const phone =
                    phoneInput.value.trim();

                const password =
                    passwordInput.value;

                const confirmPassword =
                    confirmPasswordInput.value;


                let isValid = true;


                /* ==============================
                   FULL NAME
                ============================== */

                if (!fullname) {

                    showError(
                        fullnameInput,
                        "Nama lengkap wajib diisi."
                    );

                    isValid = false;

                } else if (fullname.length < 3) {

                    showError(
                        fullnameInput,
                        "Nama lengkap minimal 3 karakter."
                    );

                    isValid = false;

                }


                /* ==============================
                   USERNAME
                ============================== */

                if (!username) {

                    showError(
                        usernameInput,
                        "Username wajib diisi."
                    );

                    isValid = false;

                } else if (username.length < 4) {

                    showError(
                        usernameInput,
                        "Username minimal 4 karakter."
                    );

                    isValid = false;

                } else if (
                    !/^[a-zA-Z0-9_]+$/.test(username)
                ) {

                    showError(
                        usernameInput,
                        "Username hanya boleh menggunakan huruf, angka, dan underscore."
                    );

                    isValid = false;

                }


                /* ==============================
                   EMAIL
                ============================== */

                const emailPattern =
                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


                if (!email) {

                    showError(
                        emailInput,
                        "Email wajib diisi."
                    );

                    isValid = false;

                } else if (
                    !emailPattern.test(email)
                ) {

                    showError(
                        emailInput,
                        "Format email tidak valid."
                    );

                    isValid = false;

                }


                /* ==============================
                   PHONE
                ============================== */

                const phoneNumber =
                    phone.replace(/\D/g, "");


                if (!phone) {

                    showError(
                        phoneInput,
                        "Nomor handphone wajib diisi."
                    );

                    isValid = false;

                } else if (
                    phoneNumber.length < 10 ||
                    phoneNumber.length > 15
                ) {

                    showError(
                        phoneInput,
                        "Nomor handphone harus 10-15 digit."
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

                } else if (password.length < 6) {

                    showError(
                        passwordInput,
                        "Password minimal 6 karakter."
                    );

                    isValid = false;

                }


                /* ==============================
                   CONFIRM PASSWORD
                ============================== */

                if (!confirmPassword) {

                    showError(
                        confirmPasswordInput,
                        "Konfirmasi password wajib diisi."
                    );

                    isValid = false;

                } else if (
                    password !== confirmPassword
                ) {

                    showError(
                        confirmPasswordInput,
                        "Password tidak sama."
                    );

                    isValid = false;

                }


                /* ==============================
                   STOP IF INVALID
                ============================== */

                if (!isValid) {
                    return;
                }


                /* ==============================
                   REGISTER BUTTON
                ============================== */

                const registerButton =
                    registerForm.querySelector(
                        ".register-button"
                    );


                if (registerButton) {

                    registerButton.disabled = true;

                    registerButton.innerHTML = `
                        <span>Membuat Akun...</span>
                    `;

                }


                /* ==============================
                   SIMULATE REGISTER
                ============================== */

                setTimeout(function () {

                    const userData = {
                        fullname: fullname,
                        username: username,
                        email: email,
                        phone: phone,
                        registeredAt:
                            new Date().toISOString()
                    };


                    /*
                     * Untuk sementara data disimpan
                     * di localStorage.
                     *
                     * Nanti bagian ini akan diganti
                     * dengan database Laravel.
                     */

                    localStorage.setItem(
                        "ibGamingRegisteredUser",
                        JSON.stringify(userData)
                    );


                    /* ==========================
                       SHOW SUCCESS MODAL
                    ========================== */

                    if (successModal) {

                        successModal.classList.add(
                            "show"
                        );

                    }


                    if (registerButton) {

                        registerButton.disabled = false;

                        registerButton.innerHTML = `
                            <span>Register</span>
                            <img
                                src="../../assets/Icon/Panah.svg"
                                alt=""
                                class="button-arrow"
                            >
                        `;

                    }

                }, 800);

            }
        );

    }


    /* ========================================
       SUCCESS LOGIN BUTTON
    ======================================== */

    if (successLoginButton) {

        successLoginButton.addEventListener(
            "click",
            function () {

                window.location.href =
                    "login.html";

            }
        );

    }


    /* ========================================
       CLOSE MODAL WHEN CLICKING OUTSIDE
    ======================================== */

    if (successModal) {

        successModal.addEventListener(
            "click",
            function (event) {

                if (
                    event.target === successModal
                ) {

                    successModal.classList.remove(
                        "show"
                    );

                }

            }
        );

    }

});