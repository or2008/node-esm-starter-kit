
// export interface TelegramPostFileReference3 {
//     _: string;
//     bytes: string;
// }

// export interface TelegramPostBytes3 {
//     _: string;
//     bytes: string;
// }

// export interface TelegramPostInflated3 {
//     _: string;
//     bytes: string;
// }

// export interface TelegramPostFileReference2 {
//     _: string;
//     bytes: string;
// }

// export interface TelegramPostBytes2 {
//     _: string;
//     bytes: string;
// }

// export interface TelegramPostInflated2 {
//     _: string;
//     bytes: string;
// }

// export interface TelegramPostStrippedThumb {
//     _: string;
//     bytes: string;
// }

// export interface TelegramPostStrippedThumb2 {
//     _: string;
//     bytes: string;
// }

// export interface TelegramPostAttribute {
//     _: string;
//     file_name: string;
// }

// export interface TelegramPostFileReference {
//     _: string;
//     bytes: string;
// }

// export interface TelegramPostBytes {
//     _: string;
//     bytes: string;
// }

// export interface TelegramPostInflated {
//     _: string;
//     bytes: string;
// }

// export interface TelegramPostSize {
//     _: string;
//     type: string;
//     bytes: TelegramPostBytes;
//     inflated: TelegramPostInflated;
//     w?: number;
//     h?: number;
//     size?: number;
//     sizes: number[];
// }

// export interface TelegramPostPhoto {
//     _: string;
//     has_stickers: boolean;
//     id: string;
//     access_hash: number;
//     file_reference: TelegramPostFileReference;
//     date: number;
//     sizes: TelegramPostSize[];
//     dc_id: number;
// }

// export interface TelegramPostSize2 {
//     _: string;
//     type: string;
//     bytes: TelegramPostBytes2;
//     inflated: TelegramPostInflated2;
//     w?: number;
//     h?: number;
//     size?: number;
//     sizes: number[];
// }

// export interface TelegramPostPhoto2 {
//     _: string;
//     has_stickers: boolean;
//     id: number;
//     access_hash: number;
//     file_reference: TelegramPostFileReference2;
//     date: number;
//     sizes: TelegramPostSize2[];
//     dc_id: number;
// }

// export interface TelegramPostPhoto3 {
//     _: string;
//     has_video: boolean;
//     photo_id: number;
//     stripped_thumb: TelegramPostStrippedThumb;
//     dc_id: number;
// }

// export interface TelegramPostPhoto4 {
//     _: string;
//     has_video: boolean;
//     photo_id: number;
//     stripped_thumb: TelegramPostStrippedThumb2;
//     dc_id: number;
// }

// export interface TelegramPostThumb {
//     _: string;
//     type: string;
//     bytes: TelegramPostBytes3;
//     inflated: TelegramPostInflated3;
//     w?: number;
//     h?: number;
//     size?: number;
// }

// export interface TelegramPostDocument {
//     _: string;
//     id: number;
//     access_hash: number;
//     file_reference: TelegramPostFileReference3;
//     date: number;
//     mime_type: string;
//     size: number;
//     thumbs: TelegramPostThumb[];
//     dc_id: number;
//     attributes: TelegramPostAttribute[];
// }

// export interface TelegramPostCaption {
//     _: string;
// }

// interface TelegramPostCachedPageBlock {
//     _: 'pageBlockAuthorDate' | 'pageBlockBlockquote' | 'pageBlockHeader' | 'pageBlockParagraph' | 'pageBlockTitle';
//     text: Text;
//     author: Author;
//     published_date?: number;
//     caption: Caption;
//     items: Item[];
//     language: string;
// }

// export interface TelegramPostCachedPage {
//     _: string;
//     part: boolean;
//     rtl: boolean;
//     v2: boolean;
//     url: string;
//     blocks: TelegramPostCachedPageBlock[];
//     photos: any[];
//     documents: any[];
// }

// export interface TelegramPostWebpage {
//     _: string;
//     id: number;
//     url: string;
//     display_url: string;
//     hash: number;
//     type: string;
//     site_name: string;
//     description: string;
//     author: string;
//     title: string;
//     photo: TelegramPostPhoto2;
//     document: TelegramPostDocument;
//     cached_page: TelegramPostCachedPage;
// }

// export interface TelegramPostMedia {
//     _: string;
//     photo: TelegramPostPhoto;
//     webpage: TelegramPostWebpage;
// }
