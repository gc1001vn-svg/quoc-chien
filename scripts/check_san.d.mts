// Khai bao kieu cho `check_san.mjs`, de `tests/CheckSan.test.ts` import `MAU` ma
// khong phai tat kiem bang `@ts-expect-error` — chinh dau ma thuoc do cam.
// Duoi phai la `.d.mts`: TS khong nhan `.d.ts` cho mot module `.mjs`, va khi
// khong nhan thi no bao TS7016 chu khong im, nen loi nay khong the lot lau.
export declare const MAU: { ten: string; re: RegExp; vi_sao: string }[];
