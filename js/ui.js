// Instancia del toast de Bootstrap usada para mostrar mensajes al usuario.
const shareToastElement = document.getElementById("shareToast");
const shareToastMessage = document.getElementById("shareToastMessage");
const shareToast = shareToastElement && window.bootstrap
    ? window.bootstrap.Toast.getOrCreateInstance(shareToastElement, { delay: 3500 })
    : null;

export function showToast(message) {
    if (!shareToast || !shareToastMessage) {
        return;
    }

    shareToastMessage.textContent = message;
    shareToast.show();
}
