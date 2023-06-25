import FormData from 'form-data';

export function convertObjectToFormData(obj: Record<string, any>): FormData {
    const formData = new FormData();

    for (const key in obj) {
        if (Array.isArray(obj[key])) {
            obj[key].forEach((item: Record<string, any>, index: number) => {
                for (const subKey in item) {
                    const fieldName = `${key}[${index}][${subKey}]`;
                    formData.append(fieldName, item[subKey]);
                }
            });
        } else {
            formData.append(key, obj[key]);
        }
    }

    return formData;
}

export function serialize(data: Iterable<[string, any]>): Record<string, any> {
    const obj: Record<string, any> = {};

    for (const [key, value] of data) {
        if (obj[key] !== undefined) {
            if (!Array.isArray(obj[key]))
                obj[key] = [obj[key]];

            obj[key].push(value);
        } else {
            obj[key] = value;
        }
    }

    return obj;
}
