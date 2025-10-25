<template>
    <div v-if="message" class="message">{{ message }}</div>
    <div class="form">
        <h2>Register account</h2>

        <!-- Registration form -->
        <form @submit.prevent="register">
            <input
                v-model="email"
                type="email"
                placeholder="E-post"
                required
            />
            <input
                v-model="password"
                type="password"
                placeholder="Password"
                required
            />
            <input
                v-model="confirmPassword"
                type="password"
                placeholder="Confirm password"
                required
            />

            <button type="submit">Register</button>
        </form>

        <!-- Link to login page -->
        <p class="form-footer">
            <span>Already have an account?</span>
            <router-link to="/login" class="switch-link">Login</router-link>
        </p>
    </div>
</template>

<script>
import api from "@/services/api";

export default {
    name: "RegisterView",
    data() {
        return {
            email: "",
            password: "",
            confirmPassword: "",
            message: "",
        };
    },

    // Save invite token from URL if one exists
    async mounted() {
        const token = this.$route.query.token;
        if (token) {
        localStorage.setItem("inviteToken", token);
        }
    },
    methods: {
        //Register a new user
        async register() {
            // Check if both passwords match
            if (this.password !== this.confirmPassword) {
                this.message = "Passwords don't match.";
                return;
            }

            try {
                const token = localStorage.getItem("inviteToken");

                // Send registration data to the backend
                const res = await api.post("/users/register", {
                email: this.email,
                password: this.password,
                token,
                });

                if (res.data.error) {
                    this.message = res.data.error;
                } else {
                    this.message = "Registration successful! Redirecting to login...";

                    // Wait 3 seconds, then redirect
                    setTimeout(() => {
                        this.message = "";
                        this.$router.push("/login");
                    }, 3000);
                }
            } catch (err) {
                console.error(err);
                this.message = "Something went wrong during registration.";
            }
        },
    },
};
</script>
