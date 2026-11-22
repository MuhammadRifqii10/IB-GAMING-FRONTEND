/**
 * menunggu-verifikasi.js
 * Detail Verifikasi Akun (Menunggu) — interaksi UI saja, tanpa backend.
 */

(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {

        // ---------------------------------------------------------
        // Tombol Valid / Tidak Valid (per dokumen)
        // ---------------------------------------------------------
        var documents = document.querySelectorAll('.menunggu-verifikasi-document');

        documents.forEach(function (doc) {
            var buttons = doc.querySelectorAll('.menunggu-verifikasi-button');

            buttons.forEach(function (button) {
                button.addEventListener('click', function () {

                    buttons.forEach(function (other) {
                        var selected = other === button;

                        other.classList.toggle('is-active', selected);
                        other.classList.toggle('is-inactive', !selected);
                        other.setAttribute('aria-pressed', selected ? 'true' : 'false');
                    });

                    doc.setAttribute('data-status', button.getAttribute('data-value'));
                });
            });
        });

        // ---------------------------------------------------------
        // Tombol Verifikasi Akun — feedback visual sederhana
        // ---------------------------------------------------------
        var submitButton = document.getElementById('menungguVerifikasiSubmit');

        if (submitButton) {
            submitButton.addEventListener('click', function () {
                submitButton.classList.add('is-clicked');

                setTimeout(function () {
                    submitButton.classList.remove('is-clicked');
                }, 250);
            });
        }

    });

})();

