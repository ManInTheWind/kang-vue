import {PexelsApiKey} from './pexel.config';
import { createClient }from 'pexels';
import type { Photos,Videos,ErrorResponse }from 'pexels';

export  const PexelsClient = createClient(PexelsApiKey);

export const PexelsPhotoSuccessModel = (obj: any): obj is Photos => {
    return typeof obj === 'object' && obj !== null && 'total_results' in obj && 'per_page' in obj && 'photos' in obj;
}

export const PexelsVideoSuccessModel = (obj: any): obj is Videos => {
    return typeof obj === 'object' && obj !== null && 'total_results' in obj && 'per_page' in obj && 'videos' in obj;
}

export interface QueryEvent{
    query:string,
    type: MediaType;
}

export enum MediaType{
    Photos,
    Video
};