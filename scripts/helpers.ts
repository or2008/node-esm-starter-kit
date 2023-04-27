import { exec } from 'node:child_process';

export async function runCommand(command: string) {
    return new Promise((resolve, reject) => {
        exec(command, (err, stdout) => {
            if (err)
                reject(err);
            if (typeof stdout === 'string')
                resolve(stdout.trim());
        });
    });
}
