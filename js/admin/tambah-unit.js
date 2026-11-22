/**
 * tambah-unit.js
 * JavaScript untuk halaman popup Tambah Unit PlayStation
 * Hanya menangani navigasi (Batal / Close) — tidak ada backend.
 */

(function () {
    'use strict';

    const KELOLA_UNIT_URL = 'kelola-unit.html';

    /**
     * Kembali ke halaman kelola-unit.html
     */
    function kembaliKeKelolaUnit() {
        window.location.href = KELOLA_UNIT_URL;
    }

    /**
     * Tangani klik di luar popup (opsional — klik overlay menutup popup)
     */
    function handleOverlayClick(event) {
        // Jika klik tepat pada overlay (bukan di dalam popup), kembali
        if (event.target === event.currentTarget) {
            kembaliKeKelolaUnit();
        }
    }

    /**
     * Tangani radio button status agar label opsi update visual-nya
     * (fallback untuk browser yang tidak support :has())
     */
    function handleStatusChange() {
        var options = document.querySelectorAll('.tambah-unit-status-option');
        var radios  = document.querySelectorAll('.tambah-unit-radio');

        radios.forEach(function (radio) {
            radio.addEventListener('change', function () {
                // Reset semua
                options.forEach(function (opt) {
                    opt.classList.remove('tambah-unit-status-option--active');
                });
                // Aktifkan yang dipilih
                if (this.checked) {
                    this.closest('.tambah-unit-status-option')
                        .classList.add('tambah-unit-status-option--active');
                }
            });
        });
    }

    /**
     * Init
     */
    document.addEventListener('DOMContentLoaded', function () {

        // Tombol Close (X)
        var closeBtn = document.getElementById('tambahUnitClose');
        if (closeBtn) {
            closeBtn.addEventListener('click', kembaliKeKelolaUnit);
        }

        // Tombol Batal
        var batalBtn = document.getElementById('tambahUnitBatal');
        if (batalBtn) {
            batalBtn.addEventListener('click', function (e) {
                e.preventDefault();
                kembaliKeKelolaUnit();
            });
        }

        // Klik overlay untuk menutup
        var overlay = document.getElementById('tambahUnitOverlay');
        if (overlay) {
            overlay.addEventListener('click', handleOverlayClick);
        }

        // Keyboard: Escape untuk menutup
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                kembaliKeKelolaUnit();
            }
        });

        // Sinkronisasi class status (fallback :has())
        handleStatusChange();

    });

})();

