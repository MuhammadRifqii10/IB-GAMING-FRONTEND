document.addEventListener("DOMContentLoaded", function () {

    /* =========================================================
       ELEMENT
       ========================================================= */

    const checkoutOrderItems =
        document.getElementById("checkoutOrderItems");

    const checkoutEmpty =
        document.getElementById("checkoutEmpty");

    const orderItemCount =
        document.getElementById("orderItemCount");

    const summaryItemCount =
        document.getElementById("summaryItemCount");

    const summarySubtotal =
        document.getElementById("summarySubtotal");

    const summaryTotal =
        document.getElementById("summaryTotal");

    const tableNumber =
        document.getElementById("tableNumber");

    const continuePaymentButton =
        document.getElementById("continuePaymentButton");

    const addMoreMenuButton =
        document.getElementById("addMoreMenuButton");


    /* =========================================================
       STORAGE KEY
       ========================================================= */

    const CART_STORAGE_KEY = "ibGamingFnbCart";
    const TABLE_STORAGE_KEY = "ibGamingTableNumber";


    /* =========================================================
       DATA
       ========================================================= */

    let orders = [];


    /* =========================================================
       FORMAT HARGA
       ========================================================= */

    function formatPrice(price) {
        return "Rp " + Number(price).toLocaleString("id-ID");
    }


    /* =========================================================
       BACA KERANJANG DARI LOCAL STORAGE
       ========================================================= */

    function loadOrders() {

        const savedOrders =
            localStorage.getItem(CART_STORAGE_KEY);

        if (!savedOrders) {
            orders = [];
            return;
        }

        try {

            const parsedOrders =
                JSON.parse(savedOrders);

            if (Array.isArray(parsedOrders)) {

                orders = parsedOrders.map(function (item) {

                    return {
                        name: item.name || "",
                        price: Number(item.price) || 0,
                        image: item.image || "",
                        quantity: Number(item.quantity) || 1,
                        note: item.note || ""
                    };

                });

            } else {

                orders = [];

            }

        } catch (error) {

            console.error(
                "Gagal membaca keranjang:",
                error
            );

            orders = [];

        }
    }


    /* =========================================================
       SIMPAN KERANJANG
       ========================================================= */

    function saveOrders() {

        localStorage.setItem(
            CART_STORAGE_KEY,
            JSON.stringify(orders)
        );

    }


    /* =========================================================
       TOTAL JUMLAH ITEM
       ========================================================= */

    function getTotalQuantity() {

        return orders.reduce(function (total, item) {

            return total + Number(item.quantity);

        }, 0);

    }


    /* =========================================================
       TOTAL HARGA
       ========================================================= */

    function getSubtotal() {

        return orders.reduce(function (total, item) {

            return total +
                (Number(item.price) * Number(item.quantity));

        }, 0);

    }


    /* =========================================================
       RENDER PESANAN
       ========================================================= */

    function renderOrders() {

        if (!checkoutOrderItems) return;

        checkoutOrderItems.innerHTML = "";


        /* -----------------------------------------------------
           EMPTY STATE
           ----------------------------------------------------- */

        if (orders.length === 0) {

            if (checkoutEmpty) {
                checkoutEmpty.classList.add("active");
            }

            if (addMoreMenuButton) {
                addMoreMenuButton.style.display = "none";
            }

            updateSummary();

            return;
        }


        /* -----------------------------------------------------
           ADA PESANAN
           ----------------------------------------------------- */

        if (checkoutEmpty) {
            checkoutEmpty.classList.remove("active");
        }

        if (addMoreMenuButton) {
            addMoreMenuButton.style.display = "flex";
        }


        orders.forEach(function (order, index) {

            const orderItem =
                document.createElement("div");

            orderItem.className =
                "checkout-order-item";


            /* -------------------------------------------------
               IMAGE
               ------------------------------------------------- */

            const image =
                document.createElement("img");

            image.className =
                "checkout-order-image";

            image.src = order.image;

            image.alt = order.name;


            /* -------------------------------------------------
               INFO
               ------------------------------------------------- */

            const info =
                document.createElement("div");

            info.className =
                "checkout-order-info";


            const name =
                document.createElement("h3");

            name.textContent =
                order.name;


            const price =
                document.createElement("p");

            price.className =
                "checkout-order-price";

            price.textContent =
                formatPrice(order.price);


            info.appendChild(name);
            info.appendChild(price);


            /* -------------------------------------------------
               NOTE
               ------------------------------------------------- */

            if (order.note && order.note.trim() !== "") {

                const note =
                    document.createElement("p");

                note.className =
                    "checkout-order-note";

                note.textContent =
                    "Catatan: " + order.note;

                info.appendChild(note);

            }


            /* -------------------------------------------------
               QUANTITY
               ------------------------------------------------- */

            const quantityControl =
                document.createElement("div");

            quantityControl.className =
                "checkout-quantity-control";


            const minusButton =
                document.createElement("button");

            minusButton.type = "button";

            minusButton.textContent = "−";

            minusButton.setAttribute(
                "aria-label",
                "Kurangi jumlah " + order.name
            );

            minusButton.dataset.index =
                index;

            minusButton.className =
                "checkout-quantity-minus";


            const quantityValue =
                document.createElement("span");

            quantityValue.className =
                "checkout-quantity-value";

            quantityValue.textContent =
                order.quantity;


            const plusButton =
                document.createElement("button");

            plusButton.type = "button";

            plusButton.textContent = "+";

            plusButton.setAttribute(
                "aria-label",
                "Tambah jumlah " + order.name
            );

            plusButton.dataset.index =
                index;

            plusButton.className =
                "checkout-quantity-plus";


            quantityControl.appendChild(
                minusButton
            );

            quantityControl.appendChild(
                quantityValue
            );

            quantityControl.appendChild(
                plusButton
            );


            info.appendChild(
                quantityControl
            );


            /* -------------------------------------------------
               DELETE BUTTON
               ------------------------------------------------- */

            const deleteButton =
                document.createElement("button");

            deleteButton.type = "button";

            deleteButton.className =
                "checkout-delete-button";

            deleteButton.dataset.index =
                index;

            deleteButton.setAttribute(
                "aria-label",
                "Hapus " + order.name
            );


            const deleteIcon =
                document.createElement("img");

            deleteIcon.src =
                "../../../assets/Icon/Trash.svg";

            deleteIcon.alt = "";


            deleteButton.appendChild(
                deleteIcon
            );


            /* -------------------------------------------------
               GABUNGKAN
               ------------------------------------------------- */

            orderItem.appendChild(image);
            orderItem.appendChild(info);
            orderItem.appendChild(deleteButton);


            checkoutOrderItems.appendChild(
                orderItem
            );

        });


        updateSummary();

    }


    /* =========================================================
       UPDATE SUMMARY
       ========================================================= */

    function updateSummary() {

        const totalQuantity =
            getTotalQuantity();

        const subtotal =
            getSubtotal();


        /* -----------------------------------------------------
           HEADER ITEM COUNT
           ----------------------------------------------------- */

        if (orderItemCount) {

            orderItemCount.textContent =
                totalQuantity + " item";

        }


        /* -----------------------------------------------------
           SUMMARY ITEM COUNT
           ----------------------------------------------------- */

        if (summaryItemCount) {

            summaryItemCount.textContent =
                totalQuantity + " item";

        }


        /* -----------------------------------------------------
           SUBTOTAL
           ----------------------------------------------------- */

        if (summarySubtotal) {

            summarySubtotal.textContent =
                formatPrice(subtotal);

        }


        /* -----------------------------------------------------
           TOTAL
           ----------------------------------------------------- */

        if (summaryTotal) {

            summaryTotal.textContent =
                formatPrice(subtotal);

        }

    }


    /* =========================================================
       QUANTITY BUTTON
       ========================================================= */

    if (checkoutOrderItems) {

        checkoutOrderItems.addEventListener(
            "click",
            function (event) {

                const minusButton =
                    event.target.closest(
                        ".checkout-quantity-minus"
                    );

                const plusButton =
                    event.target.closest(
                        ".checkout-quantity-plus"
                    );

                const deleteButton =
                    event.target.closest(
                        ".checkout-delete-button"
                    );


                /* -------------------------------------------------
                   MINUS
                   ------------------------------------------------- */

                if (minusButton) {

                    const index =
                        Number(minusButton.dataset.index);

                    if (
                        Number.isNaN(index) ||
                        !orders[index]
                    ) {
                        return;
                    }


                    orders[index].quantity -= 1;


                    if (
                        orders[index].quantity <= 0
                    ) {

                        orders.splice(index, 1);

                    }


                    saveOrders();

                    renderOrders();

                    return;
                }


                /* -------------------------------------------------
                   PLUS
                   ------------------------------------------------- */

                if (plusButton) {

                    const index =
                        Number(plusButton.dataset.index);

                    if (
                        Number.isNaN(index) ||
                        !orders[index]
                    ) {
                        return;
                    }


                    orders[index].quantity += 1;


                    saveOrders();

                    renderOrders();

                    return;
                }


                /* -------------------------------------------------
                   DELETE
                   ------------------------------------------------- */

                if (deleteButton) {

                    const index =
                        Number(deleteButton.dataset.index);

                    if (
                        Number.isNaN(index) ||
                        !orders[index]
                    ) {
                        return;
                    }


                    orders.splice(index, 1);


                    saveOrders();

                    renderOrders();

                }

            }
        );

    }


    /* =========================================================
       NOMOR MEJA
       ========================================================= */

    if (tableNumber) {

        const savedTable =
            localStorage.getItem(
                TABLE_STORAGE_KEY
            );


        if (savedTable) {

            tableNumber.value =
                savedTable;

        }


        tableNumber.addEventListener(
            "input",
            function () {

                /* Hanya angka */

                this.value =
                    this.value.replace(
                        /[^0-9]/g,
                        ""
                    );


                /* Maksimal 2 digit */

                if (this.value.length > 2) {

                    this.value =
                        this.value.slice(0, 2);

                }


                localStorage.setItem(
                    TABLE_STORAGE_KEY,
                    this.value
                );

            }
        );

    }


    /* =========================================================
       LANJUT KE PEMBAYARAN
       ========================================================= */

    if (continuePaymentButton) {
    continuePaymentButton.addEventListener("click", function () {

        if (orders.length === 0) {
            alert("Pesanan masih kosong. Silakan pilih menu terlebih dahulu.");
            return;
        }

        const currentTable = tableNumber
            ? tableNumber.value.trim()
            : "";

        if (!currentTable) {
            alert("Silakan masukkan nomor meja terlebih dahulu.");

            if (tableNumber) {
                tableNumber.focus();
            }

            return;
        }

        if (!/^\d{1,2}$/.test(currentTable)) {
            alert("Nomor meja harus berupa angka.");

            if (tableNumber) {
                tableNumber.focus();
            }

            return;
        }

        const checkoutData = {
            orders: orders,
            tableNumber: currentTable,
            subtotal: getSubtotal(),
            totalQuantity: getTotalQuantity(),
            createdAt: new Date().toISOString()
        };

        localStorage.setItem(
            "ibGamingFnbCheckout",
            JSON.stringify(checkoutData)
        );

        // Lanjut ke halaman metode pembayaran
        window.location.href = "metode-pembayaran.html";
    });
}


    /* =========================================================
       TAMBAH MENU LAIN
       ========================================================= */

    if (addMoreMenuButton) {

        addMoreMenuButton.addEventListener(
            "click",
            function () {

                /*
                 * Cart sudah tersimpan di localStorage,
                 * sehingga ketika kembali ke pesan-fnb.html
                 * isi keranjang tetap ada.
                 */

                saveOrders();

            }
        );

    }


    /* =========================================================
       INITIALIZE
       ========================================================= */

    loadOrders();

    renderOrders();

});