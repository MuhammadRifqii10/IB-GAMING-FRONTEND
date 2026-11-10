document.addEventListener("DOMContentLoaded", function () {

    /* =========================================================
       STORAGE KEY
    ========================================================= */

    const FNB_CART_KEY = "ibGamingFnbCart";
    const BOOKING_KEY = "ibGamingBooking";


    /* =========================================================
       ELEMENT
    ========================================================= */

    const fnbCartContent =
        document.getElementById("fnbCartContent");

    const bookingCartContent =
        document.getElementById("bookingCartContent");

    const cartTabs =
        document.querySelectorAll(".cart-tab");

    const cartSummaryItems =
        document.querySelector(".cart-summary-items");

    const cartSummarySubtotal =
        document.querySelector(".cart-summary-subtotal strong");

    const cartSummaryTotal =
        document.querySelector(".cart-summary-total strong");

    const checkoutButton =
        document.querySelector(".cart-checkout-button");

    const addMenuButton =
        document.querySelector(".add-menu-button");


    /* =========================================================
       FORMAT HARGA
    ========================================================= */

    function formatPrice(price) {

        return "Rp " +
            Number(price || 0).toLocaleString("id-ID");

    }


    /* =========================================================
       GET F&B CART
    ========================================================= */

    function getFnbCart() {

        try {

            const savedCart =
                localStorage.getItem(FNB_CART_KEY);

            if (!savedCart) {
                return [];
            }

            const cart =
                JSON.parse(savedCart);

            return Array.isArray(cart)
                ? cart
                : [];

        } catch (error) {

            console.error(
                "Gagal membaca keranjang F&B:",
                error
            );

            return [];

        }

    }


    /* =========================================================
       SAVE F&B CART
    ========================================================= */

    function saveFnbCart(cart) {

        localStorage.setItem(
            FNB_CART_KEY,
            JSON.stringify(cart)
        );

    }


    /* =========================================================
       GET BOOKING
    ========================================================= */

    function getBooking() {

        try {

            const savedBooking =
                localStorage.getItem(BOOKING_KEY);

            if (!savedBooking) {
                return null;
            }

            return JSON.parse(savedBooking);

        } catch (error) {

            console.error(
                "Gagal membaca data booking:",
                error
            );

            return null;

        }

    }


    /* =========================================================
       RESOLVE IMAGE PATH
       
       F&B menyimpan path gambar berdasarkan lokasi
       pesan-fnb.html.

       Karena cart.html berada satu folder berbeda,
       path perlu disesuaikan.
    ========================================================= */

    function resolveImagePath(image) {

        if (!image) {
            return "";
        }


        /*
         * Jika URL gambar dari internet,
         * langsung gunakan.
         */

        if (
            image.startsWith("http://") ||
            image.startsWith("https://")
        ) {

            return image;

        }


        /*
         * Jika menggunakan data URL.
         */

        if (
            image.startsWith("data:")
        ) {

            return image;

        }


        /*
         * Ambil nama file terakhir.
         *
         * Contoh:
         *
         * ../../../assets/Images/Indomie-Goreng.png
         *
         * menjadi:
         *
         * Indomie-Goreng.png
         */

        const fileName =
            image.split("/").pop();


        if (!fileName) {
            return "";
        }


        /*
         * cart.html berada di:
         *
         * pages/user/cart.html
         *
         * sehingga menuju:
         *
         * ../../assets/Images/
         */

        return "../../assets/Images/" + fileName;

    }


    /* =========================================================
       NORMALISASI DATA F&B
    ========================================================= */

    function normalizeFnbItem(item) {

        const name =
            item.name ||
            item.nama ||
            item.productName ||
            item.menuName ||
            "Menu F&B";


        const price =
            Number(
                item.price ||
                item.harga ||
                item.productPrice ||
                0
            );


        const quantity =
            Number(
                item.quantity ||
                item.qty ||
                item.jumlah ||
                1
            );


        const image =
            item.image ||
            item.gambar ||
            item.productImage ||
            "";


        const note =
            item.note ||
            item.catatan ||
            item.notes ||
            "";


        return {

            ...item,

            name: name,

            price: price,

            quantity:
                quantity > 0
                    ? quantity
                    : 1,

            image: image,

            note: note

        };

    }


    /* =========================================================
       TOTAL JUMLAH ITEM F&B
    ========================================================= */

    function getTotalFnbQuantity(cart) {

        return cart.reduce(
            function (total, item) {

                return total +
                    Number(item.quantity || 0);

            },
            0
        );

    }


    /* =========================================================
       HITUNG SUBTOTAL F&B
    ========================================================= */

    function calculateFnbSubtotal(cart) {

        return cart.reduce(
            function (total, item) {

                const price =
                    Number(item.price || 0);

                const quantity =
                    Number(item.quantity || 0);

                return total +
                    (price * quantity);

            },
            0
        );

    }


    /* =========================================================
       UPDATE JUMLAH TAB
    ========================================================= */

    function updateTabCount() {

        const fnbCart =
            getFnbCart()
                .map(normalizeFnbItem);


        const booking =
            getBooking();


        const fnbCount =
            getTotalFnbQuantity(fnbCart);


        const bookingCount =
            booking ? 1 : 0;


        const fnbTab =
            document.querySelector(
                '.cart-tab[data-tab="fnb"]'
            );


        const bookingTab =
            document.querySelector(
                '.cart-tab[data-tab="booking"]'
            );


        if (fnbTab) {

            const count =
                fnbTab.querySelector(
                    ".cart-tab-count"
                );

            if (count) {

                count.textContent =
                    `(${fnbCount})`;

            }

        }


        if (bookingTab) {

            const count =
                bookingTab.querySelector(
                    ".cart-tab-count"
                );

            if (count) {

                count.textContent =
                    `(${bookingCount})`;

            }

        }

    }


    /* =========================================================
       RENDER F&B CART
    ========================================================= */

    function renderFnbCart() {

        if (!fnbCartContent) {
            return;
        }


        const cart =
            getFnbCart()
                .map(normalizeFnbItem);


        /* =====================================================
           EMPTY STATE
        ===================================================== */

        if (cart.length === 0) {

            fnbCartContent.innerHTML = `

                <div class="cart-empty-state">

                    <img
                        src="../../assets/Icon/Cart.svg"
                        alt=""
                        aria-hidden="true"
                    >

                    <h3>
                        Keranjang F&B Kosong
                    </h3>

                    <p>
                        Belum ada makanan atau minuman
                        yang kamu pilih.
                    </p>

                    <a
                        href="fnb/pesan-fnb.html"
                        class="empty-state-button"
                    >
                        Pesan F&B
                    </a>

                </div>

            `;

            return;

        }


        /* =====================================================
           CLEAR CONTENT
        ===================================================== */

        fnbCartContent.innerHTML = "";


        /* =====================================================
           RENDER SETIAP ITEM
        ===================================================== */

        cart.forEach(
            function (item, index) {

                const itemTotal =
                    item.price *
                    item.quantity;


                const article =
                    document.createElement("article");


                article.className =
                    "cart-item";


                /*
                 * Resolve path gambar
                 */

                const imagePath =
                    resolveImagePath(
                        item.image
                    );


                article.innerHTML = `

                    <div class="cart-item-image">

                        <img
                            src="${imagePath}"
                            alt="${item.name}"
                            onerror="this.style.display='none';"
                        >

                    </div>


                    <div class="cart-item-info">

                        <h3 class="cart-item-name">
                            ${item.name}
                        </h3>

                        <p class="cart-item-note">
                            Catatan:
                        </p>

                        <span class="cart-item-detail">
                            ${item.note || "-"}
                        </span>

                    </div>


                    <div class="cart-item-right">

                        <div class="cart-quantity">

                            <button
                                type="button"
                                class="quantity-button"
                                data-action="decrease"
                                data-index="${index}"
                                aria-label="Kurangi jumlah"
                            >
                                −
                            </button>


                            <span class="quantity-value">
                                ${item.quantity}
                            </span>


                            <button
                                type="button"
                                class="quantity-button"
                                data-action="increase"
                                data-index="${index}"
                                aria-label="Tambah jumlah"
                            >
                                +
                            </button>

                        </div>


                        <p class="cart-item-price">
                            ${formatPrice(itemTotal)}
                        </p>


                        <button
                            type="button"
                            class="cart-delete-button"
                            data-index="${index}"
                            aria-label="Hapus ${item.name}"
                        >

                            <img
                                src="../../assets/Icon/Trash.svg"
                                alt=""
                                aria-hidden="true"
                            >

                        </button>

                    </div>

                `;


                fnbCartContent.appendChild(
                    article
                );

            }
        );


        bindFnbCartEvents();

    }


    /* =========================================================
       EVENT F&B CART
    ========================================================= */

    function bindFnbCartEvents() {

        const quantityButtons =
            fnbCartContent.querySelectorAll(
                ".quantity-button"
            );


        const deleteButtons =
            fnbCartContent.querySelectorAll(
                ".cart-delete-button"
            );


        /* =====================================================
           QUANTITY
        ===================================================== */

        quantityButtons.forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        const index =
                            Number(
                                button.dataset.index
                            );


                        const action =
                            button.dataset.action;


                        const cart =
                            getFnbCart();


                        if (
                            !cart[index]
                        ) {
                            return;
                        }


                        const currentQuantity =
                            Number(
                                cart[index].quantity
                            ) || 1;


                        if (
                            action === "increase"
                        ) {

                            cart[index].quantity =
                                currentQuantity + 1;

                        }


                        if (
                            action === "decrease"
                        ) {

                            if (
                                currentQuantity <= 1
                            ) {

                                cart.splice(
                                    index,
                                    1
                                );

                            } else {

                                cart[index].quantity =
                                    currentQuantity - 1;

                            }

                        }


                        saveFnbCart(cart);


                        renderFnbCart();

                        updateTabCount();

                        updateSummary();

                    }
                );

            }
        );


        /* =====================================================
           DELETE
        ===================================================== */

        deleteButtons.forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        const index =
                            Number(
                                button.dataset.index
                            );


                        const cart =
                            getFnbCart();


                        if (
                            !cart[index]
                        ) {
                            return;
                        }


                        cart.splice(
                            index,
                            1
                        );


                        saveFnbCart(cart);


                        renderFnbCart();

                        updateTabCount();

                        updateSummary();

                    }
                );

            }
        );

    }


    /* =========================================================
       RENDER BOOKING CART
    ========================================================= */

    function renderBookingCart() {

        if (!bookingCartContent) {
            return;
        }


        const booking =
            getBooking();


        /* =====================================================
           EMPTY
        ===================================================== */

        if (!booking) {

            bookingCartContent.innerHTML = `

                <div class="cart-empty-state">

                    <img
                        src="../../assets/Icon/Cart.svg"
                        alt=""
                        aria-hidden="true"
                    >

                    <h3>
                        Belum Ada Booking PS
                    </h3>

                    <p>
                        Belum ada booking PlayStation
                        yang kamu pilih.
                    </p>

                    <a
                        href="booking/booking-member.html"
                        class="empty-state-button"
                    >
                        Booking PS
                    </a>

                </div>

            `;

            return;

        }


        /* =====================================================
           DATA BOOKING
        ===================================================== */

        const playStation =
            booking.playStation ||
            booking.playstation ||
            booking.ps ||
            "-";


        const playStationPrice =
            Number(
                booking.playStationPrice ||
                booking.playstationPrice ||
                booking.psPrice ||
                0
            );


        const playStationImage =
            booking.playStationImage ||
            booking.playstationImage ||
            booking.psImage ||
            "";


        const tv =
            booking.tv ||
            "none";


        const tvPrice =
            Number(
                booking.tvPrice || 0
            );


        const tvImage =
            booking.tvImage ||
            "";


        const duration =
            Number(
                booking.duration ||
                booking.durasi ||
                1
            );


        const total =
            Number(
                booking.total ||
                booking.totalPrice ||
                0
            );


        const pickupDate =
            booking.pickupDate ||
            booking.tanggalPengambilan ||
            "-";


        const pickupTime =
            booking.pickupTime ||
            booking.jamPengambilan ||
            "-";


        const returnDate =
            booking.returnDate ||
            booking.tanggalPengembalian ||
            "-";


        /* =====================================================
           RESOLVE IMAGES
        ===================================================== */

        const resolvedPsImage =
            resolveImagePath(
                playStationImage
            );


        const resolvedTvImage =
            resolveImagePath(
                tvImage
            );


        /* =====================================================
           TV NAME
        ===================================================== */

        const tvName =
            tv === "none"
                ? "Tidak menggunakan TV"
                : tv;


        /* =====================================================
           RENDER
        ===================================================== */

        bookingCartContent.innerHTML = `

            <article class="cart-item">

                <div class="cart-item-image">

                    ${
                        resolvedPsImage
                            ? `
                                <img
                                    src="${resolvedPsImage}"
                                    alt="${playStation}"
                                    onerror="this.style.display='none';"
                                >
                            `
                            : ""
                    }

                </div>


                <div class="cart-item-info">

                    <h3 class="cart-item-name">
                        ${playStation}
                    </h3>

                    <p class="cart-item-note">
                        Durasi: ${duration} hari
                    </p>

                    <span class="cart-item-detail">
                        Pengambilan: ${pickupDate}
                    </span>

                </div>


                <div class="cart-item-right">

                    <p class="cart-item-price">
                        ${formatPrice(total)}
                    </p>


                    <button
                        type="button"
                        class="cart-delete-button"
                        id="deleteBookingButton"
                        aria-label="Hapus booking"
                    >

                        <img
                            src="../../assets/Icon/Trash.svg"
                            alt=""
                            aria-hidden="true"
                        >

                    </button>

                </div>

            </article>


            ${
                tv !== "none"
                    ? `

                        <article class="cart-item">

                            <div class="cart-item-image">

                                ${
                                    resolvedTvImage
                                        ? `
                                            <img
                                                src="${resolvedTvImage}"
                                                alt="${tvName}"
                                                onerror="this.style.display='none';"
                                            >
                                        `
                                        : ""
                                }

                            </div>


                            <div class="cart-item-info">

                                <h3 class="cart-item-name">
                                    ${tvName}
                                </h3>

                                <p class="cart-item-note">
                                    Durasi: ${duration} hari
                                </p>

                                <span class="cart-item-detail">
                                    Booking bersama ${playStation}
                                </span>

                            </div>


                            <div class="cart-item-right">

                                <p class="cart-item-price">
                                    ${formatPrice(
                                        tvPrice * duration
                                    )}
                                </p>

                            </div>

                        </article>

                    `
                    : ""
            }


            <div class="booking-cart-detail">

                <div class="booking-cart-detail-row">

                    <span>
                        Tanggal Pengambilan
                    </span>

                    <strong>
                        ${pickupDate}
                    </strong>

                </div>


                <div class="booking-cart-detail-row">

                    <span>
                        Jam Pengambilan
                    </span>

                    <strong>
                        ${pickupTime}
                    </strong>

                </div>


                <div class="booking-cart-detail-row">

                    <span>
                        Tanggal Pengembalian
                    </span>

                    <strong>
                        ${returnDate}
                    </strong>

                </div>


                <div class="booking-cart-detail-row">

                    <span>
                        Durasi
                    </span>

                    <strong>
                        ${duration} hari
                    </strong>

                </div>

            </div>

        `;


        const deleteBookingButton =
            document.getElementById(
                "deleteBookingButton"
            );


        if (deleteBookingButton) {

            deleteBookingButton.addEventListener(
                "click",
                function () {

                    localStorage.removeItem(
                        BOOKING_KEY
                    );


                    renderBookingCart();

                    updateTabCount();

                    updateSummary();

                }
            );

        }

    }


    /* =========================================================
       UPDATE SUMMARY
    ========================================================= */

    function updateSummary() {

        if (
            !cartSummaryItems ||
            !cartSummarySubtotal ||
            !cartSummaryTotal
        ) {
            return;
        }


        const fnbCart =
            getFnbCart()
                .map(normalizeFnbItem);


        const booking =
            getBooking();


        const fnbSubtotal =
            calculateFnbSubtotal(
                fnbCart
            );


        const bookingTotal =
            booking
                ? Number(
                    booking.total ||
                    booking.totalPrice ||
                    0
                )
                : 0;


        const grandTotal =
            fnbSubtotal +
            bookingTotal;


        /* =====================================================
           CLEAR SUMMARY
        ===================================================== */

        cartSummaryItems.innerHTML = "";


        /* =====================================================
           F&B SUMMARY
        ===================================================== */

        fnbCart.forEach(
            function (item) {

                const itemElement =
                    document.createElement(
                        "div"
                    );


                itemElement.className =
                    "cart-summary-item";


                const itemTotal =
                    Number(item.price) *
                    Number(item.quantity);


                itemElement.innerHTML = `

                    <span>
                        ${item.name}
                        ×${item.quantity}
                    </span>

                    <strong>
                        ${formatPrice(itemTotal)}
                    </strong>

                `;


                cartSummaryItems.appendChild(
                    itemElement
                );

            }
        );


        /* =====================================================
           BOOKING SUMMARY
        ===================================================== */

        if (booking) {

            const playStation =
                booking.playStation ||
                booking.playstation ||
                booking.ps ||
                "Booking PS";


            const bookingElement =
                document.createElement(
                    "div"
                );


            bookingElement.className =
                "cart-summary-item";


            bookingElement.innerHTML = `

                <span>
                    ${playStation}
                </span>

                <strong>
                    ${formatPrice(
                        bookingTotal
                    )}
                </strong>

            `;


            cartSummaryItems.appendChild(
                bookingElement
            );

        }


        /* =====================================================
           EMPTY SUMMARY
        ===================================================== */

        if (
            fnbCart.length === 0 &&
            !booking
        ) {

            const emptyElement =
                document.createElement(
                    "div"
                );


            emptyElement.className =
                "cart-summary-empty";


            emptyElement.textContent =
                "Belum ada pesanan.";


            cartSummaryItems.appendChild(
                emptyElement
            );

        }


        /* =====================================================
           SUBTOTAL
        ===================================================== */

        cartSummarySubtotal.textContent =
            formatPrice(
                grandTotal
            );


        /* =====================================================
           TOTAL
        ===================================================== */

        cartSummaryTotal.textContent =
            formatPrice(
                grandTotal
            );


        /* =====================================================
           CHECKOUT BUTTON
        ===================================================== */

        if (checkoutButton) {

            if (
                fnbCart.length === 0 &&
                !booking
            ) {

                checkoutButton.disabled =
                    true;

                checkoutButton.classList.add(
                    "disabled"
                );

            } else {

                checkoutButton.disabled =
                    false;

                checkoutButton.classList.remove(
                    "disabled"
                );

            }

        }

    }


    /* =========================================================
       TAB SWITCHING
    ========================================================= */

    function setupTabs() {

        cartTabs.forEach(
            function (tab) {

                tab.addEventListener(
                    "click",
                    function () {

                        const target =
                            tab.dataset.tab;


                        /* =====================================
                           REMOVE ACTIVE
                        ===================================== */

                        cartTabs.forEach(
                            function (item) {

                                item.classList.remove(
                                    "active"
                                );

                            }
                        );


                        /* =====================================
                           ACTIVE TAB
                        ===================================== */

                        tab.classList.add(
                            "active"
                        );


                        /* =====================================
                           SHOW F&B
                        ===================================== */

                        if (
                            target === "fnb"
                        ) {

                            if (fnbCartContent) {

                                fnbCartContent.style.display =
                                    "block";

                            }


                            if (bookingCartContent) {

                                bookingCartContent.style.display =
                                    "none";

                            }

                        }


                        /* =====================================
                           SHOW BOOKING
                        ===================================== */

                        if (
                            target === "booking"
                        ) {

                            if (fnbCartContent) {

                                fnbCartContent.style.display =
                                    "none";

                            }


                            if (bookingCartContent) {

                                bookingCartContent.style.display =
                                    "block";

                            }

                        }

                    }
                );

            }
        );

    }


    /* =========================================================
       ADD MENU LAIN
    ========================================================= */

    if (addMenuButton) {

        addMenuButton.addEventListener(
            "click",
            function () {

                window.location.href =
                    "fnb/pesan-fnb.html";

            }
        );

    }


    /* =========================================================
       CHECKOUT
    ========================================================= */

    if (checkoutButton) {

        checkoutButton.addEventListener(
            "click",
            function () {

                if (
                    checkoutButton.disabled
                ) {
                    return;
                }


                const fnbCart =
                    getFnbCart()
                        .map(normalizeFnbItem);


                const booking =
                    getBooking();


                /* =============================================
                   F&B + BOOKING
                ============================================= */

                if (
                    fnbCart.length > 0 &&
                    booking
                ) {

                    /*
                     * Untuk sementara checkout mengikuti
                     * F&B terlebih dahulu.
                     */

                    const checkoutData = {

                        orders: fnbCart,

                        total:
                            calculateFnbSubtotal(
                                fnbCart
                            )

                    };


                    localStorage.setItem(
                        "ibGamingFnbCheckout",
                        JSON.stringify(
                            checkoutData
                        )
                    );


                    window.location.href =
                        "fnb/lanjut-pemesanan.html";


                    return;

                }


                /* =============================================
                   F&B ONLY
                ============================================= */

                if (
                    fnbCart.length > 0
                ) {

                    const checkoutData = {

                        orders: fnbCart,

                        total:
                            calculateFnbSubtotal(
                                fnbCart
                            )

                    };


                    localStorage.setItem(
                        "ibGamingFnbCheckout",
                        JSON.stringify(
                            checkoutData
                        )
                    );


                    window.location.href =
                        "fnb/lanjut-pemesanan.html";


                    return;

                }


                /* =============================================
                   BOOKING ONLY
                ============================================= */

                if (booking) {

                    window.location.href =
                        "booking/metode-pembayaran.html";

                }

            }
        );

    }


    /* =========================================================
       INITIAL RENDER
    ========================================================= */

    renderFnbCart();

    renderBookingCart();

    updateTabCount();

    updateSummary();

    setupTabs();


    /* =========================================================
       DEFAULT TAB
    ========================================================= */

    const activeTab =
        document.querySelector(
            ".cart-tab.active"
        );


    if (activeTab) {

        const target =
            activeTab.dataset.tab;


        if (
            target === "booking"
        ) {

            if (fnbCartContent) {
                fnbCartContent.style.display =
                    "none";
            }


            if (bookingCartContent) {
                bookingCartContent.style.display =
                    "block";
            }

        } else {

            if (fnbCartContent) {
                fnbCartContent.style.display =
                    "block";
            }


            if (bookingCartContent) {
                bookingCartContent.style.display =
                    "none";
            }

        }

    }

});