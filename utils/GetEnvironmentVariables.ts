export class GetEnvironmentVariables {

    public static readonly PETSTORE_SWAGGER_HOST = GetEnvironmentVariables.getVar('PETSTORE_SWAGGER_HOST');


    public static getVar(key: string): string {
        const value = process.env[key];
        if(typeof value === 'undefined' || value === '') {
            return '';
        }
        return value;
    }
}