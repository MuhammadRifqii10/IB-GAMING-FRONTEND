/* ============================================
   IB GAMING - NOTIFICATION JAVASCRIPT
============================================ */

document.addEventListener("DOMContentLoaded", function () {

    /* ========================================
       ELEMENT
    ======================================== */

    const closeButton =
        document.getElementById("notificationClose");

    const backButton =
        document.getElementById("notificationBack");

    const overlay =
        document.getElementById("notificationOverlay");

    const backgroundFrame =
        document.getElementById("backgroundFrame");


    /* ========================================
       AMBIL PARAMETER URL
    ======================================== */

    const urlParams =
        new URLSearchParams(window.location.search);

    const from =
        urlParams.get("from");


    /* ========================================
       TENTUKAN HALAMAN BACKGROUND
    ======================================== */

    if (backgroundFrame) {

        if (from === "home") {

            backgroundFrame.src = "home.html";

        } else {

            backgroundFrame.src = "../../pages/index.html";

        }

    }


    /* ========================================
       FUNGSI KEMBALI
    ======================================== */

    function goBack() {

        if (from === "home") {

            window.location.href =
                "home.html";

        } else {

            window.location.href =
                "../../pages/index.html";

        }

    }


    /* ========================================
       TOMBOL CLOSE
    ======================================== */

    if (closeButton) {

        closeButton.addEventListener(
            "click",
            goBack
        );

    }


    /* ========================================
       TOMBOL KEMBALI
    ======================================== */

    if (backButton) {

        backButton.addEventListener(
            "click",
            goBack
        );

    }


    /* ========================================
       KLIK OVERLAY
    ======================================== */

    if (overlay) {

        overlay.addEventListener(
            "click",
            goBack
        );

    }


    /* ========================================
       ESCAPE
    ======================================== */

    document.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Escape") {

                goBack();

            }

        }
    );

});