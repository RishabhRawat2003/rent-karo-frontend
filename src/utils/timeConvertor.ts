export function convertUTCtoIST2(utcDateString: string) {
    const utcDate = new Date(utcDateString); // Parse UTC date
    return utcDate.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }); // Convert to IST
}