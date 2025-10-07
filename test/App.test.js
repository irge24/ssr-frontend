import { render, screen, within } from '@testing-library/vue'
import { describe, test, expect } from 'vitest'
import App from '../src/App.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', component: { template: '<div>Home</div>' } }
    ],
    })

    describe('App.vue', () => {
    test('renders navigation links', async () => {
        render(App, {
        global: {
            plugins: [router],
        },
        })
        await router.isReady()
        const homeLink = screen.getByRole('link', { name: /home/i })
        expect(homeLink).toBeTruthy()
    })

    test('renders router-view', async () => {
        render(App, {
        global: {
            plugins: [router],
        },
        })
        await router.isReady()
        const main = screen.getByRole('main')
        const homeContent = within(main).getByText(/home/i)
        expect(homeContent).toBeTruthy()
    })
})
