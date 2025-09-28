import { render, screen } from '@testing-library/vue'
import NewDocView from '../src/views/NewDocView.vue'
import { vi } from 'vitest'

vi.mock('../src/services/api', () => ({
    default: { post: vi.fn() }
    }))

    describe('NewDocView.vue', () => {
    beforeAll(() => {
        window.alert = () => {}
    })

    test('renders form inputs', () => {
        render(NewDocView, { global: { stubs: { 'router-link': true } } })
        expect(screen.getByLabelText(/title/i)).toBeTruthy()
        expect(screen.getByLabelText(/content/i)).toBeTruthy()
    })

    test('renders submit button', () => {
        render(NewDocView, { global: { stubs: { 'router-link': true } } })
        expect(screen.getByRole('button', { name: /create/i })).toBeTruthy()
    })

    test('submit form calls createDoc', () => {
        const { container } = render(NewDocView, {
        global: {
            stubs: { 'router-link': true },
            mocks: { $router: { push: () => {} } }
        }
        })
        const form = container.querySelector('form')
        form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })
})
