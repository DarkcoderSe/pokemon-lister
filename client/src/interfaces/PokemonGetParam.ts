export default interface PokemonGetParam {
    page: number;
    per_page: number;
    sort_by?: string;
    name?: string;
    base_experience?: number;
    height?: number;
    weight?: number;
}