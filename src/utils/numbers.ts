// function abs(num: bigint) {
//     return num < 0n ? -num : num;
// };

export function getPercentageChange(num1: bigint, num2: bigint) {
    if (num2 === 0n) return - num1 * 100n;
    if (num1 === 0n) return num2 * 100n;
    return (num2 - num1) * 10_000n / num1 * 100n / 10_000n;
}

export function randomNumber(min: number, max: number) { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
}
