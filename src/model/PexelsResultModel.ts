import type { PhotoEntity } from "./PhotoEntity";


export interface PexelsResultModel{
    page: number,
    per_page: number,
    photos: PhotoEntity[],
    total_results: number,
    next_page: string,
}