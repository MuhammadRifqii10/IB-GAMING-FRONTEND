/* ============================================
   IB GAMING - PROFILE JAVASCRIPT
============================================ */

document.addEventListener("DOMContentLoaded", function () {

    /* ========================================
       ELEMENT
    ======================================== */

    const profileImage =
        document.getElementById("profileImage");

    const profileImageInput =
        document.getElementById("profileImageInput");

    const cameraButton =
        document.getElementById("cameraButton");

    const profileForm =
        document.getElementById("profileForm");

    const fullNameInput =
        document.getElementById("fullName");

    const emailInput =
        document.getElementById("email");

    const phoneInput =
        document.getElementById("phone");

    const currentPasswordInput =
        document.getElementById("currentPassword");

    const newPasswordInput =
        document.getElementById("newPassword");

    const confirmPasswordInput =
        document.getElementById("confirmPassword");

    const saveButton =
        document.getElementById("saveProfileButton");

    const logoutButton =
        document.getElementById("logoutButton");

    const toggleButtons =
        document.querySelectorAll(".toggle-password");


    /* ========================================
       LOAD USER DATA
    ======================================== */

    const userData =
        localStorage.getItem("ibGamingUser");

    if (userData) {

        try {

            const user =
                JSON.parse(userData);

            if (user.fullName && fullNameInput) {
                fullNameInput.value =
                    user.fullName;
            }

            if (user.username && emailInput) {
                emailInput.value =
                    user.username;
            }

            if (user.phone && phoneInput) {
                phoneInput.value =
                    user.phone;
            }

        } catch (error) {

            console.error(
                "Data user tidak dapat dibaca:",
                error
            );

        }

    }


    /* ========================================
       TOGGLE PASSWORD
    ======================================== */

    toggleButtons.forEach(function (button) {

        button.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

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

            }
        );

    });


    /* ========================================
       CAMERA / UPLOAD FOTO
    ======================================== */

    if (cameraButton && profileImageInput) {

        cameraButton.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                /*
                 * Membuka File Explorer
                 */
                profileImageInput.click();

            }
        );


        profileImageInput.addEventListener(
            "change",
            function () {

                const file =
                    profileImageInput.files[0];

                if (!file) {
                    return;
                }


                /* ==============================
                   VALIDASI FORMAT
                ============================== */

                const allowedTypes = [
                    "image/png",
                    "image/jpeg",
                    "image/jpg"
                ];

                if (!allowedTypes.includes(file.type)) {

                    showNotification(
                        "Format Foto Tidak Sesuai",
                        "Silakan pilih foto dengan format PNG, JPG, atau JPEG.",
                        "error"
                    );

                    profileImageInput.value = "";

                    return;
                }


                /* ==============================
                   VALIDASI UKURAN
                ============================== */

                const maxSize =
                    2 * 1024 * 1024;

                if (file.size > maxSize) {

                    showNotification(
                        "Ukuran Foto Terlalu Besar",
                        "Ukuran foto maksimal adalah 2MB.",
                        "error"
                    );

                    profileImageInput.value = "";

                    return;
                }


                /* ==============================
                   PREVIEW FOTO
                ============================== */

                const reader =
                    new FileReader();

                reader.onload =
                    function (event) {

                        if (profileImage) {

                            profileImage.src =
                                event.target.result;

                        }

                    };

                reader.readAsDataURL(file);

            }
        );

    }


    /* ========================================
       ERROR HANDLING
    ======================================== */

    function removeError(input) {

        if (!input) {
            return;
        }

        input.classList.remove(
            "input-error"
        );

        const formGroup =
            input.closest(".form-group");

        if (!formGroup) {
            return;
        }

        const errorMessage =
            formGroup.querySelector(
                ".error-message"
            );

        if (errorMessage) {
            errorMessage.remove();
        }

    }


    function showError(input, message) {

        if (!input) {
            return;
        }

        removeError(input);

        input.classList.add(
            "input-error"
        );

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

        formGroup.appendChild(
            errorMessage
        );

    }


    /* ========================================
       REMOVE ERROR SAAT USER MENGETIK
    ======================================== */

    const inputElements = [

        fullNameInput,
        emailInput,
        phoneInput,
        currentPasswordInput,
        newPasswordInput,
        confirmPasswordInput

    ];

    inputElements.forEach(function (input) {

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
       SAVE PROFILE
    ======================================== */

    if (profileForm) {

        profileForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();

                let isValid = true;


                /* ==============================
                   DATA
                ============================== */

                const fullName =
                    fullNameInput
                        ? fullNameInput.value.trim()
                        : "";

                const email =
                    emailInput
                        ? emailInput.value.trim()
                        : "";

                const phone =
                    phoneInput
                        ? phoneInput.value.trim()
                        : "";

                const currentPassword =
                    currentPasswordInput
                        ? currentPasswordInput.value
                        : "";

                const newPassword =
                    newPasswordInput
                        ? newPasswordInput.value
                        : "";

                const confirmPassword =
                    confirmPasswordInput
                        ? confirmPasswordInput.value
                        : "";


                /* ==============================
                   VALIDASI NAMA
                ============================== */

                if (!fullName) {

                    showError(
                        fullNameInput,
                        "Nama lengkap wajib diisi."
                    );

                    isValid = false;

                }


                /* ==============================
                   VALIDASI EMAIL
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
                   VALIDASI TELEPON
                ============================== */

                const phonePattern =
                    /^[0-9+\-\s]{10,16}$/;

                if (!phone) {

                    showError(
                        phoneInput,
                        "Nomor telepon wajib diisi."
                    );

                    isValid = false;

                } else if (
                    !phonePattern.test(phone)
                ) {

                    showError(
                        phoneInput,
                        "Nomor telepon tidak valid."
                    );

                    isValid = false;

                }


                /* ==================================
                   VALIDASI PASSWORD
                ================================== */

                const changingPassword =
                    currentPassword ||
                    newPassword ||
                    confirmPassword;


                if (changingPassword) {

                    if (!currentPassword) {

                        showError(
                            currentPasswordInput,
                            "Password saat ini wajib diisi."
                        );

                        isValid = false;

                    }

                    if (!newPassword) {

                        showError(
                            newPasswordInput,
                            "Password baru wajib diisi."
                        );

                        isValid = false;

                    } else if (
                        newPassword.length < 6
                    ) {

                        showError(
                            newPasswordInput,
                            "Password minimal 6 karakter."
                        );

                        isValid = false;

                    }

                    if (!confirmPassword) {

                        showError(
                            confirmPasswordInput,
                            "Konfirmasi password wajib diisi."
                        );

                        isValid = false;

                    } else if (
                        newPassword !==
                        confirmPassword
                    ) {

                        showError(
                            confirmPasswordInput,
                            "Konfirmasi password tidak sama."
                        );

                        isValid = false;

                    }

                }


                /* ==================================
                   STOP JIKA ERROR
                ================================== */

                if (!isValid) {
                    return;
                }


                /* ==================================
                   BUTTON LOADING
                ================================== */

                if (saveButton) {

                    saveButton.disabled = true;

                    saveButton.innerHTML =
                        "Menyimpan...";

                }


                /* ==================================
                   SIMULASI SIMPAN
                ================================== */

                setTimeout(function () {

                    let user = {};

                    const storedUser =
                        localStorage.getItem(
                            "ibGamingUser"
                        );

                    if (storedUser) {

                        try {

                            user =
                                JSON.parse(
                                    storedUser
                                );

                        } catch (error) {

                            user = {};

                        }

                    }


                    /* Update data */

                    user.fullName =
                        fullName;

                    user.username =
                        email;

                    user.phone =
                        phone;

                    user.loggedIn =
                        true;


                    /* Simpan */

                    localStorage.setItem(
                        "ibGamingUser",
                        JSON.stringify(user)
                    );


                    /* Reset password */

                    if (currentPasswordInput) {
                        currentPasswordInput.value = "";
                    }

                    if (newPasswordInput) {
                        newPasswordInput.value = "";
                    }

                    if (confirmPasswordInput) {
                        confirmPasswordInput.value = "";
                    }


                    /* Button */

                    if (saveButton) {

                        saveButton.disabled =
                            false;

                        saveButton.innerHTML =
                            "Simpan Perubahan";

                    }


                    /* ==================================
                       NOTIFICATION SUCCESS
                    ================================== */

                    showNotification(
                        "Profil Berhasil Disimpan",
                        "Perubahan informasi profil kamu berhasil disimpan.",
                        "success"
                    );

                }, 700);

            }
        );

    }


    /* ========================================
       LOGOUT
    ======================================== */

    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                /*
                 * Hapus status login
                 */

                localStorage.removeItem(
                    "ibGamingUser"
                );

                localStorage.removeItem(
                    "ibGamingRememberedUser"
                );


                /*
                 * Redirect ke login
                 */

                window.location.href =
                    "../index.html";

            }
        );

    }


    /* ========================================
       NOTIFICATION
    ======================================== */

    function showNotification(
        title,
        message,
        type = "success"
    ) {

        const notification =
            document.getElementById(
                "profileNotification"
            );

        const notificationTitle =
            document.getElementById(
                "profileNotificationTitle"
            );

        const notificationMessage =
            document.getElementById(
                "profileNotificationMessage"
            );

        const notificationIcon =
            document.getElementById(
                "profileNotificationIcon"
            );


        if (
            !notification ||
            !notificationTitle ||
            !notificationMessage
        ) {
            return;
        }


        notificationTitle.textContent =
            title;

        notificationMessage.textContent =
            message;


        /* ==============================
           TYPE
        ============================== */

        notification.classList.remove(
            "success",
            "error"
        );

        notification.classList.add(
            type
        );


        if (notificationIcon) {

            notificationIcon.textContent =
                type === "success"
                    ? "✓"
                    : "!";

        }


        /* ==============================
           SHOW
        ============================== */

        notification.classList.add(
            "show"
        );


        /* ==============================
           AUTO CLOSE
        ============================== */

        setTimeout(function () {

            notification.classList.remove(
                "show"
            );

        }, 3500);

    }

});