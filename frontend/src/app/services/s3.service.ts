import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class S3Service {

    constructor(private http: HttpClient) {  }

    getUploadPresignedUrl(fileName: string, file: File): Observable<{ url: string }> {
        const params = new HttpParams()
          .set('filename', fileName)
          .set('filetype', file.type)
          .set('operation', 'putObject');
        return this.http.get<{ url: string }>('http://localhost:3000/generate-presigned-url', { params });
    }
    
    getAccessPresignedUrl(fileName: string): Observable<{ url: string }> {
        const params = new HttpParams()
          .set('filename', fileName)
          .set('operation', 'getObject');
        return this.http.get<{ url: string }>('http://localhost:3000/generate-presigned-url', { params });
    }
    
    uploadFileToS3(presignedUrl: string, file: File): Observable<void> {
        const headers = new HttpHeaders().set('Content-Type', file.type);
        console.log(presignedUrl, file);
        return this.http.put<void>(presignedUrl, file, { headers });
    }
}
  