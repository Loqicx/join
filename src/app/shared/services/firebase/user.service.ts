import { inject, Injectable } from '@angular/core';
import {
    Auth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    user,
    User,
} from '@angular/fire/auth';
import { from, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    user$: Observable<User | null>;

    auth = inject(Auth);

    constructor() {
        this.user$ = user(this.auth);
    }

    // Login example usage:
    // this.userService.login(email, password).subscribe({
    //   next: () => {
    //     this.router.navigateByUrl('/summary');
    //   },
    //   error: (error) => {
    //     console.error("Blabla something wrong", error);
    //   }
    // })

    login(email: string, password: string): Observable<void> {
        const promise = signInWithEmailAndPassword(this.auth, email, password).then(() => {});
        return from(promise);
    }

    logout(): Observable<void> {
        const promise = signOut(this.auth).then(() => {
            sessionStorage.clear();
        });
        return from(promise);
    }

    signUp(email: string, password: string): Observable<void> {
        const promise = createUserWithEmailAndPassword(this.auth, email, password).then((result) => {
            // Example
            const user = result.user;
            // Do stuff with user
            // trigger notification
            // ...
        });
        return from(promise);
    }
}
