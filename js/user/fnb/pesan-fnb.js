document.addEventListener("DOMContentLoaded", function () {

    /* =========================================================
       ELEMENT
    ========================================================= */

    const productCards = document.querySelectorAll(".fnb-product-card");

    const orderItemsContainer =
        document.querySelector(".order-items");

    const subtotalElement =
        document.querySelector(".order-subtotal strong");


    /* =========================================================
       DETAIL PRODUK
    ========================================================= */

    const productDetailOverlay =
        document.getElementById("productDetailOverlay");

    const productDetailClose =
        document.getElementById("productDetailClose");

    const productDetailCancel =
        document.getElementById("productDetailCancel");

    const productDetailSubmit =
        document.getElementById("productDetailSubmit");

    const detailProductImage =
        document.getElementById("detailProductImage");

    const detailProductName =
        document.getElementById("detailProductName");

    const detailProductPrice =
        document.getElementById("detailProductPrice");

    const detailProductNote =
        document.getElementById("detailProductNote");

    const detailQuantity =
        document.getElementById("detailQuantity");

    const detailQuantityMinus =
        document.getElementById("detailQuantityMinus");

    const detailQuantityPlus =
        document.getElementById("detailQuantityPlus");


    /* =========================================================
       DATA PESANAN
    ========================================================= */

    let orders = [];

    let selectedProduct = null;

    let selectedQuantity = 1;

    const CART_STORAGE_KEY = "ibGamingFnbCart";

    function saveOrders() {
        localStorage.setItem(
            CART_STORAGE_KEY,
            JSON.stringify(orders)
        );
    }


    /* =========================================================
       FORMAT HARGA
    ========================================================= */

    function parsePrice(priceText) {

        return parseInt(
            priceText
                .replace(/Rp/g, "")
                .replace(/\./g, "")
                .replace(/\s/g, "")
        ) || 0;

    }


    function formatPrice(price) {

        return "Rp " + price.toLocaleString("id-ID");

    }


    /* =========================================================
       BUKA DETAIL PRODUK
    ========================================================= */

    function openProductDetail(card) {

        const nameElement =
            card.querySelector(".product-name");

        const priceElement =
            card.querySelector(".product-price");

        const imageElement =
            card.querySelector(".product-image");


        if (
            !nameElement ||
            !priceElement ||
            !imageElement
        ) {
            return;
        }


        /* Simpan produk yang dipilih */

        selectedProduct = {

            name: nameElement.textContent.trim(),

            price: parsePrice(
                priceElement.textContent
            ),

            image: imageElement.getAttribute("src")

        };


        /* Reset jumlah */

        selectedQuantity = 1;


        /* Masukkan data ke detail */

        detailProductImage.src =
            selectedProduct.image;

        detailProductImage.alt =
            selectedProduct.name;

        detailProductName.textContent =
            selectedProduct.name;

        detailProductPrice.textContent =
            formatPrice(selectedProduct.price);

        detailQuantity.textContent =
            selectedQuantity;


        /* Kosongkan catatan */

        detailProductNote.value = "";


        /* Tampilkan overlay */

        productDetailOverlay.classList.add("active");

        document.body.style.overflow = "hidden";

    }


    /* =========================================================
       TUTUP DETAIL PRODUK
    ========================================================= */

    function closeProductDetail() {

        productDetailOverlay.classList.remove("active");

        document.body.style.overflow = "";

        selectedProduct = null;

    }


    /* =========================================================
       TOMBOL TAMBAH PADA PRODUK
    ========================================================= */

    productCards.forEach(function (card) {

        const addButton =
            card.querySelector(".add-product-button");


        if (!addButton) {
            return;
        }


        addButton.addEventListener("click", function (event) {

            event.preventDefault();

            event.stopPropagation();


            /*
             * PENTING:
             * Tombol Tambah TIDAK langsung memasukkan
             * produk ke Pesanan Saya.
             *
             * Tombol ini hanya membuka detail produk.
             */

            openProductDetail(card);

        });

    });


    /* =========================================================
       TOMBOL CLOSE (X)
    ========================================================= */

    if (productDetailClose) {

        productDetailClose.addEventListener(
            "click",
            function () {

                closeProductDetail();

            }
        );

    }


    /* =========================================================
       TOMBOL BATAL
    ========================================================= */

    if (productDetailCancel) {

        productDetailCancel.addEventListener(
            "click",
            function () {

                closeProductDetail();

            }
        );

    }


    /* =========================================================
       KLIK BACKGROUND UNTUK MENUTUP
    ========================================================= */

    if (productDetailOverlay) {

        productDetailOverlay.addEventListener(
            "click",
            function (event) {

                if (
                    event.target ===
                    productDetailOverlay
                ) {

                    closeProductDetail();

                }

            }
        );

    }


    /* =========================================================
       QUANTITY -
    ========================================================= */

    if (detailQuantityMinus) {

        detailQuantityMinus.addEventListener(
            "click",
            function () {

                if (selectedQuantity > 1) {

                    selectedQuantity -= 1;

                    detailQuantity.textContent =
                        selectedQuantity;

                }

            }
        );

    }


    /* =========================================================
       QUANTITY +
    ========================================================= */

    if (detailQuantityPlus) {

        detailQuantityPlus.addEventListener(
            "click",
            function () {

                selectedQuantity += 1;

                detailQuantity.textContent =
                    selectedQuantity;

            }
        );

    }


    /* =========================================================
       TAMBAH KE KERANJANG
    ========================================================= */

    if (productDetailSubmit) {

        productDetailSubmit.addEventListener(
            "click",
            function () {

                if (!selectedProduct) {
                    return;
                }


                /*
                 * Cek apakah produk sudah ada
                 * di Pesanan Saya
                 */

                const existingProduct =
                    orders.find(function (item) {

                        return (
                            item.name ===
                            selectedProduct.name
                        );

                    });


                if (existingProduct) {

                    existingProduct.quantity +=
                        selectedQuantity;


                    /*
                     * Update catatan kalau
                     * diperlukan
                     */

                    if (
                        detailProductNote.value.trim()
                    ) {

                        existingProduct.note =
                            detailProductNote.value.trim();

                    }

                }

                else {

                    orders.push({

                        name:
                            selectedProduct.name,

                        price:
                            selectedProduct.price,

                        image:
                            selectedProduct.image,

                        quantity:
                            selectedQuantity,

                        note:
                            detailProductNote.value.trim()

                    });

                }


                /* Render pesanan */

               saveOrders();

                renderOrders();

                /* Tutup detail */

                closeProductDetail();

            }
        );

    }


    /* =========================================================
       RENDER PESANAN
    ========================================================= */

    function renderOrders() {

        if (!orderItemsContainer) {
            return;
        }


        orderItemsContainer.innerHTML = "";


        orders.forEach(function (order, index) {

            const orderItem =
                document.createElement("div");

            orderItem.className =
                "order-item";


            orderItem.innerHTML = `

                <img
                    src="${order.image}"
                    alt="${order.name}"
                    class="order-item-image"
                >

                <div class="order-item-info">

                    <h3>
                        ${order.name}
                    </h3>

                    <p>
                        ${formatPrice(order.price)}
                    </p>

                    <div class="quantity-control">

                        <button
                            type="button"
                            class="quantity-button quantity-minus"
                            data-index="${index}"
                        >
                            −
                        </button>

                        <span class="quantity-value">
                            ${order.quantity}
                        </span>

                        <button
                            type="button"
                            class="quantity-button quantity-plus"
                            data-index="${index}"
                        >
                            +
                        </button>

                    </div>

                </div>

            `;


            orderItemsContainer.appendChild(
                orderItem
            );

        });


        updateSubtotal();

    }


    /* =========================================================
       SUB TOTAL
    ========================================================= */

    function updateSubtotal() {

        let subtotal = 0;


        orders.forEach(function (order) {

            subtotal +=
                order.price *
                order.quantity;

        });


        if (subtotalElement) {

            subtotalElement.textContent =
                formatPrice(subtotal);

        }

    }


    /* =========================================================
       QUANTITY DI PESANAN SAYA
    ========================================================= */

    if (orderItemsContainer) {

        orderItemsContainer.addEventListener(
            "click",
            function (event) {

                const button =
                    event.target.closest(
                        ".quantity-button"
                    );


                if (!button) {
                    return;
                }


                const index =
                    parseInt(
                        button.dataset.index
                    );


                if (Number.isNaN(index)) {
                    return;
                }


                /* Tombol + */

                if (
                    button.classList.contains(
                        "quantity-plus"
                    )
                ) {

                    orders[index].quantity += 1;

                }


                /* Tombol - */

                if (
                    button.classList.contains(
                        "quantity-minus"
                    )
                ) {

                    orders[index].quantity -= 1;


                    if (
                        orders[index].quantity <= 0
                    ) {

                        orders.splice(index, 1);

                    }

                }

                saveOrders();
                renderOrders();

            }
        );

    }


    /* =========================================================
       PESANAN AWAL DARI HTML
    ========================================================= */

    function initializeOrders() {

        if (!orderItemsContainer) {
            return;
        }


        const existingItems =
            orderItemsContainer.querySelectorAll(
                ".order-item"
            );


        existingItems.forEach(function (item) {

            const nameElement =
                item.querySelector("h3");

            const priceElement =
                item.querySelector("p");

            const imageElement =
                item.querySelector(
                    ".order-item-image"
                );

            const quantityElement =
                item.querySelector(
                    ".quantity-value"
                );


            if (
                !nameElement ||
                !priceElement ||
                !imageElement
            ) {
                return;
            }


            orders.push({

                name:
                    nameElement.textContent.trim(),

                price:
                    parsePrice(
                        priceElement.textContent
                    ),

                image:
                    imageElement.getAttribute("src"),

                quantity:
                    quantityElement
                        ? parseInt(
                            quantityElement.textContent.trim()
                        ) || 1
                        : 1,

                note: ""

            });

        });


        updateSubtotal();

    }


    /* =========================================================
       JALANKAN
    ========================================================= */

    initializeOrders();

const continueOrderButton =
    document.querySelector(".continue-order-button");

if (continueOrderButton) {

    continueOrderButton.addEventListener(
        "click",
        function () {

            saveOrders();

            window.location.href =
                "lanjut-pemesanan.html";

        }
    );

}

});