import { inject, Injectable } from '@angular/core';
import {
    Auth,
    browserSessionPersistence,
    createUserWithEmailAndPassword,
    setPersistence,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
    user,
    User,
} from '@angular/fire/auth';
import { firstValueFrom, from, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    user$: Observable<User | null>;

    auth = inject(Auth);

    constructor() {
        this.user$ = user(this.auth);
        this.auth.setPersistence(browserSessionPersistence).catch((e) => {
            console.error(e);
        });
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
        const promise = signInWithEmailAndPassword(this.auth, email, password).then((result) => {
            console.log('logged in', result.user);
        });
        return from(promise);
    }

    logout(): Observable<void> {
        const promise = signOut(this.auth).then(() => {
            sessionStorage.clear();
        });
        return from(promise);
    }

    signUp(email: string, password: string, displayName: string): Observable<void> {
        const promise = createUserWithEmailAndPassword(this.auth, email, password).then(async (result) => {
            // Example
            const user = result.user;
            await updateProfile(user, { displayName })
            await result.user.reload()
            // trigger notification
            // ...
        });
        return from(promise);
    }
}
