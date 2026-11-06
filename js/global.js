
/* ============================================
   IB GAMING - GLOBAL JAVASCRIPT
============================================ */

/**
 * Helper untuk mengambil element berdasarkan ID
 */
function getElement(id) {
    return document.getElementById(id);
}


/**
 * Helper untuk mengambil banyak element
 */
function getElements(selector) {
    return document.querySelectorAll(selector);
}


/**
 * Redirect ke halaman tertentu
 */
function goToPage(page) {
    window.location.href = page;
}


/**
 * Menyimpan data ke localStorage
 */
function saveToStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}


/**
 * Mengambil data dari localStorage
 */
function getFromStorage(key) {
    const data = localStorage.getItem(key);

    if (!data) {
        return null;
    }

    try {
        return JSON.parse(data);
    } catch (error) {
        return data;
    }
}


/**
 * Menghapus data dari localStorage
 */
function removeFromStorage(key) {
    localStorage.removeItem(key);
}


/**
 * Menampilkan pesan sederhana
 */
function showMessage(message) {
    alert(message);
}


/**
 * Jalankan ketika DOM sudah siap
 */
document.addEventListener("DOMContentLoaded", function () {
    console.log("IB Gaming Global JS Loaded");
});