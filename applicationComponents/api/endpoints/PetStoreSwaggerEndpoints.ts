import {GetEnvironmentVariables} from "../../../utils/GetEnvironmentVariables";


const PETSTORE_SWAGGER_HOST = GetEnvironmentVariables.PETSTORE_SWAGGER_HOST || 'https://petstore.swagger.io/v2';


export const PetStoreSwaggerEndpoints = {

    post_CreateStoreUser: `${PETSTORE_SWAGGER_HOST}/user/createWithList`,

    get_user_Details:(username: string) => `${PETSTORE_SWAGGER_HOST}/user/${username}`,

    update_user: (username: string) => `${PETSTORE_SWAGGER_HOST}/user/${username}`,

    delete_user: (username: string) => `${PETSTORE_SWAGGER_HOST}/user/${username}`

}