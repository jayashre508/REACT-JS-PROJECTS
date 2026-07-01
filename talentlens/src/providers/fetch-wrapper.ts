//creating customFetch is very useful for making requests to the graphQL API improving code reusability because we can Define some specifics that are going to happen on every single fetch that we make
import { GraphQLFormattedError } from 'graphql'; 
import { url } from 'inspector';

type Error = {
    message: string;
    statusCode: string ;
}


const customFetch = async (url: string, options: RequestInit) => {
   // lets get accesstoken from the localstorage
    const accessToken = localStorage.getItem('access_token');
    const headers  = options.headers as Record<string, string>;

    return await fetch(url, {
        ...options,
        headers: {
            ...headers,
            Authorization: headers?.Authorization ||  `Bearer ${accessToken}`,
            "Content-Type": "application/json",
            "Apollo-Require-Preflight": "true",
        }
    })
}

const getGraphQLErrors = (body: Record<"errors", GraphQLFormattedError[] | undefined>) : Error | null => {
    if(!body) {
        return {
            message: 'Unknown error',
            statusCode: "INTERNAL_SERVER_ERROR"
        }
    }

    if("errors" in body) {
        const errors = body?.errors;
        const messages = errors?.map(error => error.message).join(", ");
        const code = errors?.map(error => error.extensions?.code).join(", ");

        return {
            message: messages || JSON.stringify(errors),
           statusCode: code || "500"
        }
    }

    return null;
}

export const fetchWrapper = async (url: string, options: RequestInit) => {
    const response = await customFetch(url, options);
    const responseClone = response.clone(); 
    const body = await responseClone.json(); 
    
    const error = getGraphQLErrors(body);

    if(error) {
        throw error;
    }

    return response;
}