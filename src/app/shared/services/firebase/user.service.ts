import { inject, Injectable } from '@angular/core';
import { Auth, user, User } from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    user$: Observable<User | null>;

    auth = inject(Auth);

    constructor() {
        this.user$ = user(this.auth);
    }
}
