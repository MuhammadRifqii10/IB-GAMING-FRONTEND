document.addEventListener("DOMContentLoaded", function () {

    /* =========================================================
       FORM ELEMENT
    ========================================================= */

    const playStationInputs =
        document.querySelectorAll('input[name="playstation"]');

    const tvInputs =
        document.querySelectorAll('input[name="tv"]');

    const pickupDate =
        document.getElementById("pickupDate");

    const pickupTime =
        document.getElementById("pickupTime");

    const returnDate =
        document.getElementById("returnDate");

    const continueButton =
        document.getElementById("continueBookingButton");


    /* =========================================================
       SUMMARY ELEMENT
    ========================================================= */

    const summaryPlayStation =
        document.getElementById("summaryPlayStation");

    const summaryPlayStationImage =
        document.getElementById("summaryPlayStationImage");

    const summaryPlayStationPrice =
        document.getElementById("summaryPlayStationPrice");

    const summaryTV =
        document.getElementById("summaryTV");

    const summaryTVImage =
        document.getElementById("summaryTVImage");

    const summaryTVPrice =
        document.getElementById("summaryTVPrice");

    const summaryTVDevice =
        document.getElementById("summaryTVDevice");

    const summaryPickupDate =
        document.getElementById("summaryPickupDate");

    const summaryPickupTime =
        document.getElementById("summaryPickupTime");

    const summaryReturnDate =
        document.getElementById("summaryReturnDate");

    const summaryDuration =
        document.getElementById("summaryDuration");

    const summaryTotal =
        document.getElementById("summaryTotal");


    /* =========================================================
       CEK ELEMENT
       Supaya script tidak error kalau ada ID yang belum tersedia
    ========================================================= */

    if (
        !pickupDate ||
        !pickupTime ||
        !returnDate ||
        !continueButton ||
        !summaryPlayStation ||
        !summaryPlayStationImage ||
        !summaryPlayStationPrice ||
        !summaryTV ||
        !summaryTVImage ||
        !summaryTVPrice ||
        !summaryTVDevice ||
        !summaryPickupDate ||
        !summaryPickupTime ||
        !summaryReturnDate ||
        !summaryDuration ||
        !summaryTotal
    ) {
        console.error(
            "Booking Form: Ada elemen HTML yang tidak ditemukan."
        );

        return;
    }


    /* =========================================================
       FORMAT HARGA
    ========================================================= */

    function formatPrice(price) {

        return "Rp" +
            Number(price).toLocaleString("id-ID");

    }


    /* =========================================================
       FORMAT TANGGAL
    ========================================================= */

    function formatDate(dateValue) {

        if (!dateValue) {
            return "-";
        }

        const date =
            new Date(dateValue + "T00:00:00");

        return date.toLocaleDateString(
            "id-ID",
            {
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
            }
        );

    }


    /* =========================================================
       GET PLAYSTATION TERPILIH
    ========================================================= */

    function getSelectedPlayStation() {

        return document.querySelector(
            'input[name="playstation"]:checked'
        );

    }


    /* =========================================================
       GET TV TERPILIH
    ========================================================= */

    function getSelectedTV() {

        return document.querySelector(
            'input[name="tv"]:checked'
        );

    }


    /* =========================================================
       UPDATE SUMMARY PLAYSTATION
    ========================================================= */

    function updatePlayStationSummary() {

        const selectedPS =
            getSelectedPlayStation();


        /* Belum pilih PS */

        if (!selectedPS) {

            summaryPlayStation.textContent =
                "Belum dipilih";

            summaryPlayStationPrice.textContent =
                "-";

            summaryPlayStationImage.src =
                "";

            summaryPlayStationImage.alt =
                "";

            return;
        }


        /* Nama PlayStation */

        summaryPlayStation.textContent =
            selectedPS.value;


        /* Harga PlayStation */

        const price =
            Number(selectedPS.dataset.price);

        summaryPlayStationPrice.textContent =
            formatPrice(price) + " / hari";


        /* Gambar PlayStation */

        const image =
            selectedPS.dataset.image;

        if (image) {

            summaryPlayStationImage.src =
                image;

            summaryPlayStationImage.alt =
                selectedPS.value;

            summaryPlayStationImage.style.display =
                "block";

        } else {

            summaryPlayStationImage.src =
                "";

            summaryPlayStationImage.alt =
                "";

            summaryPlayStationImage.style.display =
                "none";

        }

    }


    /* =========================================================
       UPDATE SUMMARY TV
    ========================================================= */

    function updateTVSummary() {

        const selectedTV =
            getSelectedTV();


        /* Tidak menggunakan TV */

        if (
            !selectedTV ||
            selectedTV.value === "none"
        ) {

            summaryTV.textContent =
                "Tidak digunakan";

            summaryTVPrice.textContent =
                "-";

            summaryTVImage.src =
                "";

            summaryTVImage.alt =
                "";

            summaryTVImage.style.display =
                "none";

            summaryTVDevice.style.display =
                "none";

            return;
        }


        /* Tampilkan bagian TV */

        summaryTVDevice.style.display =
            "flex";


        /* Nama TV */

        summaryTV.textContent =
            selectedTV.value;


        /* Harga TV */

        const price =
            Number(selectedTV.dataset.price);

        summaryTVPrice.textContent =
            formatPrice(price) + " / hari";


        /* Gambar TV */

        const image =
            selectedTV.dataset.image;

        if (image) {

            summaryTVImage.src =
                image;

            summaryTVImage.alt =
                selectedTV.value;

            summaryTVImage.style.display =
                "block";

        } else {

            summaryTVImage.src =
                "";

            summaryTVImage.alt =
                "";

            summaryTVImage.style.display =
                "none";

        }

    }


    /* =========================================================
       HITUNG DURASI PENYEWAAN
       
       Contoh:
       8 → 9  = 1 hari
       8 → 10 = 2 hari
    ========================================================= */

    function calculateDuration() {

        if (
            !pickupDate.value ||
            !returnDate.value
        ) {
            return 0;
        }


        const pickup =
            new Date(
                pickupDate.value + "T00:00:00"
            );


        const returned =
            new Date(
                returnDate.value + "T00:00:00"
            );


        const difference =
            returned.getTime() -
            pickup.getTime();


        return Math.max(
            0,
            Math.round(
                difference /
                (1000 * 60 * 60 * 24)
            )
        );

    }


    /* =========================================================
       UPDATE SUMMARY JADWAL
    ========================================================= */

    function updateScheduleSummary() {

        summaryPickupDate.textContent =
            formatDate(
                pickupDate.value
            );


        summaryPickupTime.textContent =
            pickupTime.value || "-";


        summaryReturnDate.textContent =
            formatDate(
                returnDate.value
            );

    }


    /* =========================================================
       UPDATE DURASI & TOTAL
    ========================================================= */

    function updatePriceSummary() {

        const selectedPS =
            getSelectedPlayStation();

        const selectedTV =
            getSelectedTV();


        const duration =
            calculateDuration();


        /* Durasi */

        summaryDuration.textContent =
            duration + " hari";


        /* Harga PS */

        const psPrice =
            selectedPS
                ? Number(
                    selectedPS.dataset.price
                )
                : 0;


        /* Harga TV */

        const tvPrice =
            selectedTV &&
            selectedTV.value !== "none"
                ? Number(
                    selectedTV.dataset.price
                )
                : 0;


        /* Total */

        const total =
            (psPrice + tvPrice) *
            duration;


        summaryTotal.textContent =
            formatPrice(total);

    }


    /* =========================================================
       UPDATE SEMUA SUMMARY
    ========================================================= */

    function updateSummary() {

        updatePlayStationSummary();

        updateTVSummary();

        updateScheduleSummary();

        updatePriceSummary();

    }


    /* =========================================================
       VALIDASI TANGGAL
    ========================================================= */

    function validateDates() {

        if (!pickupDate.value) {
            return;
        }


        /* Tanggal pengembalian minimal
           sama dengan tanggal pengambilan */

        returnDate.min =
            pickupDate.value;


        /* Kalau tanggal pengembalian
           lebih kecil dari pengambilan */

        if (
            returnDate.value &&
            returnDate.value < pickupDate.value
        ) {

            returnDate.value =
                "";

        }

    }


    /* =========================================================
       MINIMUM PICKUP DATE
       
       Tidak bisa memilih tanggal sebelum hari ini
    ========================================================= */

    const today =
        new Date()
            .toISOString()
            .split("T")[0];


    pickupDate.min =
        today;


    /* =========================================================
       EVENT PLAYSTATION
    ========================================================= */

    playStationInputs.forEach(
        function (input) {

            input.addEventListener(
                "change",
                function () {

                    updateSummary();

                }
            );

        }
    );


    /* =========================================================
       EVENT TV
    ========================================================= */

    tvInputs.forEach(
        function (input) {

            input.addEventListener(
                "change",
                function () {

                    updateSummary();

                }
            );

        }
    );


    /* =========================================================
       EVENT TANGGAL PENGAMBILAN
    ========================================================= */

    pickupDate.addEventListener(
        "change",
        function () {

            validateDates();

            updateSummary();

        }
    );


    /* =========================================================
       EVENT JAM PENGAMBILAN
    ========================================================= */

    pickupTime.addEventListener(
        "change",
        function () {

            updateSummary();

        }
    );


    /* =========================================================
       EVENT TANGGAL PENGEMBALIAN
    ========================================================= */

    returnDate.addEventListener(
        "change",
        function () {

            validateDates();

            updateSummary();

        }
    );


    /* =========================================================
       LANJUT KE METODE PEMBAYARAN
    ========================================================= */

    continueButton.addEventListener(
        "click",
        function () {


            /* =============================================
               GET DATA
            ============================================= */

            const selectedPS =
                getSelectedPlayStation();

            const selectedTV =
                getSelectedTV();


            /* =============================================
               VALIDASI PLAYSTATION
            ============================================= */

            if (!selectedPS) {

                alert(
                    "Silakan pilih PlayStation terlebih dahulu."
                );

                return;
            }


            /* =============================================
               VALIDASI TANGGAL PENGAMBILAN
            ============================================= */

            if (!pickupDate.value) {

                alert(
                    "Silakan pilih tanggal pengambilan."
                );

                pickupDate.focus();

                return;
            }


            /* =============================================
               VALIDASI JAM
            ============================================= */

            if (!pickupTime.value) {

                alert(
                    "Silakan pilih jam pengambilan."
                );

                pickupTime.focus();

                return;
            }


            /* =============================================
               VALIDASI TANGGAL PENGEMBALIAN
            ============================================= */

            if (!returnDate.value) {

                alert(
                    "Silakan pilih tanggal pengembalian."
                );

                returnDate.focus();

                return;
            }


            /* =============================================
               HITUNG DURASI
            ============================================= */

            const duration =
                calculateDuration();


            if (duration <= 0) {

                alert(
                    "Tanggal pengembalian harus setelah tanggal pengambilan."
                );

                returnDate.focus();

                return;
            }


            /* =============================================
               HARGA PLAYSTATION
            ============================================= */

            const psPrice =
                Number(
                    selectedPS.dataset.price
                );


            /* =============================================
               HARGA TV
            ============================================= */

            const tvPrice =
                selectedTV &&
                selectedTV.value !== "none"
                    ? Number(
                        selectedTV.dataset.price
                    )
                    : 0;


            /* =============================================
               TOTAL
            ============================================= */

            const total =
                (psPrice + tvPrice) *
                duration;


            /* =============================================
               DATA BOOKING
            ============================================= */

            const bookingData = {

                playStation:
                    selectedPS.value,

                playStationPrice:
                    psPrice,

                playStationImage:
                    selectedPS.dataset.image || "",

                tv:
                    selectedTV
                        ? selectedTV.value
                        : "none",

                tvPrice:
                    tvPrice,

                tvImage:
                    selectedTV
                        ? selectedTV.dataset.image || ""
                        : "",

                pickupDate:
                    pickupDate.value,

                pickupTime:
                    pickupTime.value,

                returnDate:
                    returnDate.value,

                duration:
                    duration,

                total:
                    total,

                createdAt:
                    new Date().toISOString()

            };


            /* =============================================
               SIMPAN KE LOCAL STORAGE
            ============================================= */

            localStorage.setItem(
                "ibGamingBooking",
                JSON.stringify(
                    bookingData
                )
            );


            /* =============================================
               REDIRECT
            ============================================= */

            window.location.href =
                "metode-pembayaran.html";

        }
    );


    const continueBookingButton =
        document.getElementById("continueBookingButton");

    if (continueBookingButton) {
        continueBookingButton.addEventListener("click", function () {

            window.location.href = "metode-pembayaran.html";

        });
    }


    /* =========================================================
       INITIAL SUMMARY
    ========================================================= */

    updateSummary();

});