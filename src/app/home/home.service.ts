import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { Observable } from "rxjs";
import { UserModel } from "../auth/models/auth.models";

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  private backendUrl = environment.backendUrl;

  constructor(
    private http: HttpClient
  ) { }


  getAllUsers(): Observable<any> {
    return this.http.get(`${this.backendUrl}/api/users`);
  }

  getUserById(id: number): Observable<any> {
    return this.http.get(`${this.backendUrl}/api/users/${id}`);
  }

  getCurrentUser(): Observable<any> {
    return this.http.post(`${this.backendUrl}/api/current-user`, {});
  }

  createUser(userData: UserModel): Observable<any> {
    return this.http.post(`${this.backendUrl}/api/users`, userData);
  }

  updateUser(id: number, userData: UserModel): Observable<any> {
    return this.http.put(`${this.backendUrl}/api/users/${id}`, userData);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.backendUrl}/api/users/${id}`);
  }

  getAllProjects(): Observable<any> {
    return this.http.get(`${this.backendUrl}/api/projects`);
  }

  getProjectById(id: number): Observable<any> {
    return this.http.get(`${this.backendUrl}/api/projects/${id}`);
  }

  createProject(projectData: any): Observable<any> {
    return this.http.post(`${this.backendUrl}/api/projects`, projectData);
  }

  updateProject(id: number, projectData: any): Observable<any> {
    return this.http.put(`${this.backendUrl}/api/projects/${id}`, projectData);
  }

  deleteProject(id: number): Observable<any> {
    return this.http.delete(`${this.backendUrl}/api/projects/${id}`);
  }
}
