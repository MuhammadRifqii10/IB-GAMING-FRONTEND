document.addEventListener("DOMContentLoaded", function () {

    console.log("BOOKING MEMBER JS BERHASIL DIBACA");

    const joinMemberButton =
        document.getElementById("joinMemberButton");

    console.log("Tombol Join Member:", joinMemberButton);

    if (!joinMemberButton) {
        console.error("Tombol joinMemberButton tidak ditemukan.");
        return;
    }

    joinMemberButton.addEventListener("click", function () {

        console.log("JOIN MEMBER DIKLIK");

        window.location.href = "booking-form.html";

    });

});