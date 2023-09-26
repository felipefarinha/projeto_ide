export let isMobileDevice = Boolean

export function verificaDispositivo() {
    let details = navigator.userAgent;
    let regexp = /android|iphone|kindle|ipad/i;
    isMobileDevice = regexp.test(details);

    // if (isMobileDevice) {console.log("You are using a Mobile Device") } 
    // else { console.log("You are using Desktop") }
    return isMobileDevice
}