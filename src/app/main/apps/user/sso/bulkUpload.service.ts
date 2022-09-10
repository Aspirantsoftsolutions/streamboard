import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

@Injectable({ providedIn: 'root' })
export class BulkUploadService {

    constructor(private _httpClient: HttpClient) {

    }

    createBulkTeachers(data: any[]) {
        const url = `${environment.apiUrl}/api/auth/bulkRegisterTeacher`
        return this._httpClient.post(url, data);
    }

    createBulkStudents(data: any[]) {
        const url = `${environment.apiUrl}/api/auth/bulkRegisterStudent`
        return this._httpClient.post(url, data);
    }
}