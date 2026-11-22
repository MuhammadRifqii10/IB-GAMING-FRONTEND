/**
 * edit-unit.js
 * JavaScript untuk halaman popup Edit Unit PlayStation.
 * Hanya menangani navigasi (Batal / Close) dan interaksi
 * radio status — tanpa backend.
 */

(function () {
    'use strict';

    var KELOLA_UNIT_URL = 'kelola-unit.html';

    /* --------------------------------------------------------
       Kembali ke Kelola Unit PS
    -------------------------------------------------------- */
    function kembaliKeKelolaUnit() {
        window.location.href = KELOLA_UNIT_URL;
    }

    /* --------------------------------------------------------
       Klik overlay di luar popup → tutup
    -------------------------------------------------------- */
    function handleOverlayClick(event) {
        if (event.target === event.currentTarget) {
            kembaliKeKelolaUnit();
        }
    }

    /* --------------------------------------------------------
       Sinkronisasi class is-active pada status pill
       (fallback browser yang belum support :has())
    -------------------------------------------------------- */
    function syncStatusActive() {
        var options = document.querySelectorAll('.edit-unit-status-option');
        var radios  = document.querySelectorAll('.edit-unit-radio');

        function updateActive() {
            options.forEach(function (opt) {
                opt.classList.remove('is-active');
            });
            radios.forEach(function (radio) {
                if (radio.checked) {
                    radio.closest('.edit-unit-status-option')
                         .classList.add('is-active');
                }
            });
        }

        radios.forEach(function (radio) {
            radio.addEventListener('change', updateActive);
        });

        // Jalankan sekali saat load untuk status default (Tersedia)
        updateActive();
    }

    /* --------------------------------------------------------
       Init
    -------------------------------------------------------- */
    document.addEventListener('DOMContentLoaded', function () {

        // Tombol Close (X)
        var closeBtn = document.getElementById('editUnitClose');
        if (closeBtn) {
            closeBtn.addEventListener('click', kembaliKeKelolaUnit);
        }

        // Tombol Batal
        var batalBtn = document.getElementById('editUnitBatal');
        if (batalBtn) {
            batalBtn.addEventListener('click', function (e) {
                e.preventDefault();
                kembaliKeKelolaUnit();
            });
        }

        // Klik overlay untuk menutup
        var overlay = document.getElementById('editUnitOverlay');
        if (overlay) {
            overlay.addEventListener('click', handleOverlayClick);
        }

        // Keyboard: Escape untuk menutup
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                kembaliKeKelolaUnit();
            }
        });

        // Sinkronisasi status pill
        syncStatusActive();

    });

})();

