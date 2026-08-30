import { UserProfile, UserRole } from "../types";

const CURRENT_USER_KEY = 'airchitect_current_user';

export const authService = {
    init: () => {
        // No-op
    },

    // Used for the Role Selection screen
    loginAsRole: (role: UserRole): UserProfile => {
        let name = 'Admin User';
        let email = 'admin@airchitect.com';

        switch (role) {
            case UserRole.PROJECT_MANAGER:
                name = 'Aditi Rao';
                email = 'aditi.pm@airchitect.com';
                break;
            case UserRole.SITE_MANAGER:
                name = 'Rahul Sharma';
                email = 'rahul.site@airchitect.com';
                break;
            case UserRole.SITE_ENGINEER:
                name = 'Amit Verma';
                email = 'amit.eng@airchitect.com';
                break;
            case UserRole.CLIENT:
                name = 'Vikram Singh';
                email = 'vikram.client@gmail.com';
                break;
        }

        const user: UserProfile = {
            id: `user-${role}`,
            name,
            email,
            role,
            avatar: ''
        };

        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
        return user;
    },

    login: async (email: string): Promise<UserProfile> => {
        const user = authService.loginAsRole(UserRole.PROJECT_MANAGER);
        if (email) user.email = email;
        return user;
    },

    register: async (name: string, email: string, role: UserRole): Promise<UserProfile> => {
         const user: UserProfile = {
            id: Date.now().toString(),
            name,
            email,
            role,
            avatar: ''
        };
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
        return user;
    },

    logout: () => {
        localStorage.removeItem(CURRENT_USER_KEY);
    },

    getCurrentUser: (): UserProfile | null => {
        const stored = localStorage.getItem(CURRENT_USER_KEY);
        return stored ? JSON.parse(stored) : null;
    }
};