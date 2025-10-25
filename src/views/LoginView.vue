<template>
    <div v-if="message" class="message">{{ message }}</div>
    <div class="form">
        <h2>Login</h2>

        <!-- Login form -->
        <form @submit.prevent="login">
        <input v-model="email" type="email" placeholder="E-post" required />
        <input v-model="password" type="password" placeholder="Password" required />
        <button type="submit">Login</button>
        </form>

        <!-- Link to registration page -->
        <p class="form-footer">
            <span>No account?</span>
            <router-link to="/register" class="switch-link">Register</router-link>
        </p>
    </div>
</template>

<script>
import api from "@/services/api";

export default {
    name: "LoginView",
    data() {
        return {
            email: "",
            password: "",
            message: "",
        };
    },
    methods: {
        // Log in user and save token
        async login() {
        try {
            const res = await api.post("/users/login", {
            email: this.email,
            password: this.password,
            });
            if (res.data.token) {
                // Save token to local storage
                localStorage.setItem("token", res.data.token);
                this.message = "Login successful! Redirecting...";

                // Redirect after 3 seconds
                setTimeout(() => {
                this.message = "";
                this.$router.push("/");
                }, 3000);
            } else {
                this.message = "Incorrect information";
            }
        } catch (err) {
            this.message ="Login error";
            console.error(err);
        }
        },
    },
};
</script>
