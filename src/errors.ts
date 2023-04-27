export class CustomError extends Error {
    public readonly payload: unknown;

    public readonly name: string = 'CustomError';

    public constructor(message: string, payload?: unknown) {
        super(message);

        // assign the error class name in your custom error (as a shortcut)
        this.payload = payload;

        // 👇️ because we are extending a built-in class
        Object.setPrototypeOf(this, CustomError.prototype);
    }
}
